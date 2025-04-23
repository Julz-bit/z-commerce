import 'fastify';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { StoreModel } from '../drizzle/models.type';

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload;
    store?: StoreModel;
  }
}
