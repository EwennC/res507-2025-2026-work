import Fastify from "fastify";
import formbody from "@fastify/formbody";
import view from "@fastify/view";
import handlebars from "handlebars";
import postgres from "@fastify/postgres";

export async function buildApp() {
  const app = Fastify({ logger: true });

  if (process.env.NODE_ENV === "test") {
    app.decorate("pg", {
      query: async () => ({ rows: [] })
    });
  } else {
    await app.register(postgres, {
      connectionString:
        process.env.DATABASE_URL ?? "postgres://postgres@localhost/postgres"
    });
  }

  await app.register(formbody);
  await app.register(view, {
    engine: { handlebars: handlebars },
    root: new URL("./views/", import.meta.url).pathname
  });

  app.get("/health", async () => ({ ok: true }));

  app.get("/", async (_req, reply) => {
    const result = await app.pg.query("SELECT * FROM quotes");
    const quotes = result.rows;

    return reply.view("index.hbs", { quotes });
  });

  app.post("/quotes", async (req, reply) => {
    const author = (req.body?.author ?? "").trim();
    const text = (req.body?.text ?? "").trim();

    if (!text) {
      return reply.redirect("/");
    }

    await app.pg.query(
      "INSERT INTO quotes (author, text) VALUES ($1, $2)",
      [author || "anonymous", text]
    );

    app.log.info(
      { quote: { author: author || "anonymous", text } },
      "New quote added"
    );

    return reply.redirect("/");
  });

  return app;
}