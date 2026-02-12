const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT || '3000', 10)
console.log(
  `> Server starting at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`,
  'bun:',
  process.versions.bun,
  'node:',
  process.versions.node,
)

import { createServer } from 'node:http'
import next from 'next'
import { initIo } from '@/lib/ws/server'
import { wsPath } from '@/lib/config'
const app = next({ dev })
const handle = app.getRequestHandler()
app.prepare().then(() => {
  const httpServer = createServer((req, res)=>{
    if (!req.url?.startsWith(wsPath)) {
      handle(req, res)
    }
  })
  initIo(httpServer) // 添加 await，确保 io 就绪后再 listen
// httpServer.re
  httpServer
    .once('error', err => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(
        `> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`,
      )
    })
})
// import type { Serve } from "bun";

// const server = Bun.serve({
//   fetch(req, env) {
//     return new Response("Bun!");
//   },
// }) // satisfies Serve.Options<undefined>;
// console.log(`Server running at ${server.url}`);