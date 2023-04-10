import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const server: FastifyInstance = fastify({ logger: true });

server.all('/', (request: FastifyRequest, reply: FastifyReply) => {
  const { query, body, params, headers, raw, log }: FastifyRequest = request;
  console.log({ query, body, params, headers });
  log.info({ query, body, params, headers });
  log.debug({ query, body, params, headers });
  reply.send({ hello: 'world' });
});

server.listen({ port: 3000 });
