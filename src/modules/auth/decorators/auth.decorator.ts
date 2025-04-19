import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const jwtPayload = request.user;
    const { sub, ...rest } = jwtPayload;
    return { id: sub, ...rest };
  },
);
