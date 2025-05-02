import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import { unfurl } from "unfurl.js";

const app = Fastify({
  logger: true,
});

app.get("/api/ping", async (_, reply) => {
  return reply.status(200).send({ message: "pong" });
});

app.get("/", async (req, reply) => {
  return reply.status(200).type("text/html").send(html);
});

app.get("/api", async (request: FastifyRequest, reply: FastifyReply) => {
  const query = request.query as APIParams;

  if (!query.url) {
    return reply.status(400).send({ error: "url is required" });
  }

  const result = await unfurl(query.url, {
    oembed: query.oembed,
    timeout: query.timeout,
    follow: query.follow,
    compress: query.compress,
    size: query.size,
    headers: query.headers,
  });

  return reply.status(200).send(result);
});

if (process.env.BUN_ENV === "development") {
  app.listen({ port: 3000 }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`Server listening at ${address}`);
  });
}

export default async function handler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready();
  app.server.emit("request", request, reply);
}

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css"
    />
    <title>Vercel + Fastify Hello World</title>
    <meta
      name="description"
      content="This is a starter template for Vercel + Fastify."
    />
  </head>
  <body>
    <h1>Vercel + Fastify Hello World</h1>
    <p>
      This is a starter template for Vercel + Fastify. Requests are
      rewritten from <code>/*</code> to <code>/api/*</code>, which runs
      as a Vercel Function.
    </p>
    <p>
        For example, here is the boilerplate code for this route:
    </p>
    <pre>
<code>import Fastify from 'fastify'

const app = Fastify({
  logger: true,
})

app.get('/', async (req, res) => {
  return res.status(200).type('text/html').send(html)
})

export default async function handler(req: any, res: any) {
  await app.ready()
  app.server.emit('request', req, res)
}</code>
    </pre>
    <p>
    <p>
      <a href="https://vercel.com/templates/other/fastify-serverless-function">
      Deploy your own
      </a>
      to get started.
  </body>
</html>
`;
