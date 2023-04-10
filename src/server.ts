import { config } from 'dotenv';
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

config();

const server: FastifyInstance = fastify({ logger: true });

server.all('/', (request: FastifyRequest, reply: FastifyReply) => {
  const { query, body, params, headers, raw, log }: FastifyRequest = request;
  console.log({ query, body, params, headers });
  log.info({ query, body, params, headers });
  log.debug({ query, body, params, headers });
  reply.send({ hello: 'world' });
});

export default async (req: unknown, res: unknown) => {
  await server.ready();
  server.server.emit('request', req, res);
};
