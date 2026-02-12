// import { Hono } from 'hono'
// import { handle } from 'hono/vercel'
// import { Server as Engine } from "@socket.io/bun-engine";
// import { Server } from "socket.io";
// const io = new Server();

// const engine = new Engine();

// io.bind(engine);

// io.on("connection", (socket) => {
//   // ...
// });

// const { websocket } = engine.handler();
// const app = new Hono().basePath('/api/hono')

// app.get('/hello', (c) => {
//   return c.json({
//     message: 'Hello Next.js!',
//   })
// })


// export const GET = (req: Request) => {
//     const url = new URL(req.url);

//     if (url.pathname === "/socket.io/") {
//       return engine.handleRequest(req);
//     } else {
//       return app.fetch(req);
//     }
// }
// export const POST = handle(app)
// export const PUT = handle(app)
// export const PATCH = handle(app)
// export const DELETE = handle(app)
// export const HEAD = handle(app)
// export const OPTIONS = handle(app)