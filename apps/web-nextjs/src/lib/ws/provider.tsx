"use client";
// lib/ws/provider.tsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io as ioClient, type Socket } from "socket.io-client";
import { wsPath } from "../config";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";
// import { toast } from "@/app/a/ui/toast";
import { toast } from "sonner";
import type { AuthSession } from "@/features/auth/auth";
import { useSession } from "@/features/auth/hook/query";
import { User } from "@/components/uix/user";

// type Transport = "polling" | "websocket" | "N/A";
interface IoClient extends Socket<ServerToClientEvents, ClientToServerEvents> {}
const SocketIoContext = createContext({
  ioC: null as IoClient | null,
  isConnected: false,
  transport: "N/A",
});
export const useSocketIo = () => {
  const c = useContext(SocketIoContext);
  if (!c) throw new Error("useSocketIo must be used within SocketIoProvider");
  return c;
};

export const SocketIoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ioC, setIo] = useState<IoClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  useEffect(() => {
    const socket: IoClient = ioClient(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: wsPath,
      addTrailingSlash: false,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    });
    socket.on("disconnect", () => {
      // socket.emit("");
      setIsConnected(false);
      setTransport("N/A");
    });
    socket.on("friend_request", (data) => {
      // toast.msg(data.username, data.image, data.msg);
      toast(
        <User name={data.username} src={data.image} description={data.msg} />,
      );
    });
    setIo(socket);
    return () => {
      socket.disconnect();
    };
  }, []);
  const prevSessionRef = useRef<AuthSession | null>(null); // 存上个 session
  const ret = useSession();
  // 新增：监听 session 变化，自动 emit logged/logout
  useEffect(() => {
    console.log("SessionProvider: 监听 session 变化");
    if (!ioC) return; // WS 未就绪，跳过 emit
    if (ret.session === undefined) return; // 未就绪，跳过
    const currentSession = ret.session;
    const prevSession = prevSessionRef.current;

    // 从无到有：登录, emit "logged"
    if (!prevSession?.user?.id && currentSession?.user?.id) {
      console.log("SessionProvider: 检测到登录，发送 'logged' 事件");
      ioC.emit("logged", currentSession.user.id);
    }
    // 从有到无：退出，emit "logout"
    else if (prevSession?.user?.id && !currentSession?.user?.id) {
      console.log("SessionProvider: 检测到退出，发送 'logout' 事件");
      ioC.emit("logout", prevSession.user.id);
    }

    // 更新 prev ref
    prevSessionRef.current = currentSession;
  }, [ret.session, ioC]); // 依赖 session 数据和 io
  const value = { ioC, isConnected, transport };

  return (
    <SocketIoContext.Provider value={value}>
      {children}
    </SocketIoContext.Provider>
  );
};
