import type { Server as HttpServer } from "node:http";
import type { NextApiRequest, NextApiResponse } from "next";
import { initIo } from "@/lib/ws/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

type NodeResponse = NextApiResponse & {
  socket: {
    // node:net.Socket
    server?: HttpServer; // node:http.HttpServer 被挂载 在 res.socket 上 但作为内部属性 并没有暴露给外部
  };
};
// NextApiRequest extends IncomingMessage
const ioHandler = (req: NextApiRequest, res: NodeResponse) => {
  const fullUrl = `http://${req.headers.host}${req.url}`;
  const urlObj = new URL(fullUrl);
  const sid = urlObj.searchParams.get("sid");
  const isHandshake = !sid;
  console.log("isHandshake:", isHandshake);

  // if (!res.socket.server.io) {
  //   const httpServer: NetServer = res?.socket.server as any;

  //   res.socket.server.io = io;
  // }

  // res.socket

  if (!res.socket.server) {
    console.log("no server");
    res.send("no server");
    return;
  }
  // res.end('next:ok1')
  // res.end('next:ok2')
  initIo(res.socket.server);
  if (isHandshake) {
    console.log("handshake:ok");
    // API resolved without sending a response for /api/ws?EIO=4&transport=polling&t=uhz2jc0a, this may result in stalled requests.
    res.end("handshake:ok");
  }
};

export default ioHandler;
