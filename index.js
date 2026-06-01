import Fastify from "fastify";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true,
});
fastify.register(import('@fastify/static'), {
  root: path.join(__dirname, "build"),
})

try {
  await fastify.listen({ port: 3000 });

  
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
