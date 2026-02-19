'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { wsPath } from '@repo/constants'; // bun i
import { io as ioClient, type Socket } from 'socket.io-client';
import { DemoContext, type IoClient } from '@/app/demo/react/provider/provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log('.../app/demo/react/provider');
  const [io, setIo] = useState<IoClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');
  useEffect(() => {
    const socket: IoClient = ioClient(process.env.NEXT_PUBLIC_SITE_URL, {
      path: wsPath,
      addTrailingSlash: false,
    });
    socket.on('connect', () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    });
    socket.on('disconnect', () => {
      // socket.emit("");
      setIsConnected(false);
      setTransport('N/A');
    });

    setIo(socket);
    return () => {
      socket.disconnect();
    };
  }, []);
  type AuthSession = {
    user: {
      id: string;
    };
  };
  const prevSessionRef = useRef<AuthSession | null>(null); // 存上个 session
  // const ret = useSession()
  // const session = {user: {id: '123'}}
  const [session] = useState({ user: { id: '123' } });
  // 新增：监听 session 变化，自动 emit logged/logout
  useEffect(() => {
    console.log('SessionProvider: 监听 session 变化');
    if (!io) {
      console.log('SessionProvider: WS 未就绪');
      return;
    } // WS 未就绪，跳过 emit
    if (session === undefined) {
      console.log('SessionProvider: session 未就绪');
      return;
    } // 未就绪，跳过
    const currentSession = session;
    const prevSession = prevSessionRef.current;

    // 从无到有：登录, emit "logged"
    if (!prevSession?.user?.id && currentSession?.user?.id) {
      console.log("SessionProvider: 检测到登录，发送 'logged' 事件");
      io.emit('logged', currentSession.user.id);
    }
    // 从有到无：退出，emit "logout"
    else if (prevSession?.user?.id && !currentSession?.user?.id) {
      console.log("SessionProvider: 检测到退出，发送 'logout' 事件");
      io.emit('logout', prevSession.user.id);
    }

    // 更新 prev ref
    prevSessionRef.current = currentSession;
  }, [session, io]); // 依赖 session 数据和 io
  const value = { io, isConnected, transport };
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
