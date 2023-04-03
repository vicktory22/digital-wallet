import { createServer } from "./server";

async function start() {
  const server = await createServer({
    opts: {
      logger: true,
    },
  });

  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
