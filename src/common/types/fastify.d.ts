import 'fastify';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload;
  }
}
