/**
 * Mostlane H&S Plan — jobs API (Cloudflare Worker + D1)
 *
 * Routes (all require  Authorization: Bearer <APP_TOKEN>):
 *   GET    /jobs        -> [{id,name,updated_at}, ...]
 *   GET    /jobs/:id    -> full job JSON (the saved answers)
 *   PUT    /jobs/:id    -> body = job JSON; upserts
 *   DELETE /jobs/:id    -> removes a job
 *
 * Bindings (see wrangler.toml):
 *   env.DB        -> D1 database
 *   env.APP_TOKEN -> shared access token (set with: wrangler secret put APP_TOKEN)
 */
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Authorization,Content-Type",
      "Access-Control-Max-Age": "86400",
    };
    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, "Content-Type": "application/json" } });

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    // ---- auth ----
    const token = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    if (!env.APP_TOKEN || token !== env.APP_TOKEN) return json({ error: "unauthorized" }, 401);

    const parts = new URL(request.url).pathname.split("/").filter(Boolean); // ["jobs", id?]
    if (parts[0] !== "jobs") return json({ error: "not found" }, 404);
    const id = parts[1];

    try {
      if (request.method === "GET" && !id) {
        const { results } = await env.DB
          .prepare("SELECT id, name, updated_at FROM jobs ORDER BY updated_at DESC").all();
        return json(results || []);
      }
      if (request.method === "GET" && id) {
        const row = await env.DB.prepare("SELECT data FROM jobs WHERE id = ?").bind(id).first();
        if (!row) return json({ error: "not found" }, 404);
        return json(JSON.parse(row.data));
      }
      if (request.method === "PUT" && id) {
        const body = await request.json();
        const name = (body && body.projectName ? String(body.projectName) : "").trim() || "Untitled job";
        const now = new Date().toISOString();
        await env.DB.prepare(
          `INSERT INTO jobs (id, name, data, updated_at) VALUES (?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET name = excluded.name, data = excluded.data, updated_at = excluded.updated_at`
        ).bind(id, name, JSON.stringify(body), now).run();
        return json({ ok: true, id, name, updated_at: now });
      }
      if (request.method === "DELETE" && id) {
        await env.DB.prepare("DELETE FROM jobs WHERE id = ?").bind(id).run();
        return json({ ok: true });
      }
      return json({ error: "method not allowed" }, 405);
    } catch (e) {
      return json({ error: String(e && e.message || e) }, 500);
    }
  },
};
