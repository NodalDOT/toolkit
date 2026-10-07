import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { DIST_DIR, getConfig } from "../config/index.ts";

const { port } = getConfig();

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyStatic, {
  root: DIST_DIR,
});

try {
  await fastify.listen({ port });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
