import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { StoreService } from '../store.service';
import { FastifyRequest } from 'fastify';

@Injectable()
export class StoreOwnerGuard implements CanActivate {
  constructor(private readonly storeService: StoreService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const params = request.params as { storeId: string };
    const headers = request.headers as { 'x-store-id'?: string };
    const storeId = params.storeId || headers['x-store-id'];
    const userId = request.user?.sub;

    if (!storeId) {
      throw new BadRequestException('store id must be provided');
    }

    const store = await this.storeService.findOne(storeId);
    if (store.ownerId !== userId) {
      throw new ForbiddenException('you do not own this store');
    }

    //assign store into request to return into controller
    request.store = store;

    return true;
  }
}
