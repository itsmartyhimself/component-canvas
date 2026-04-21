import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

const app = new Hono()

app.use("*", logger())
app.use("*", cors())

app.get("/health", (c) => c.json({ ok: true }))

const port = 4000

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Component Canvas API running on http://localhost:${info.port}`)
})
