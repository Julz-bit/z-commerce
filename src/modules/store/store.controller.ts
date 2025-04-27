import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { AuthGuard } from '@app/modules/auth/guards/auth.guard';
import { Auth } from '@app/modules/auth/decorators/auth.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from '@app/common/interfaces/auth-user.interface';
import { StoreOwnerGuard } from './guards/store-owner.guard';
import { FastifyRequest } from 'fastify';

@ApiTags('Store Service')
@ApiBearerAuth()
@Controller('store')
@UseGuards(AuthGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new store' })
  async create(@Body() body: CreateStoreDto, @Auth() auth: AuthUser) {
    return await this.storeService.create(body, auth.id);
  }

  @Get(':storeId')
  @UseGuards(StoreOwnerGuard)
  @ApiOperation({ summary: 'Get store via id' })
  @ApiParam({
    name: 'storeId',
    type: String,
    description: 'store id',
    example: 'wbqfo03a0qx8qmyjviitx03q',
  })
  findOne(@Req() req: FastifyRequest) {
    return req.store;
  }

  @Patch(':storeId')
  @UseGuards(StoreOwnerGuard)
  @ApiOperation({ summary: 'Update store' })
  async update(
    @Param('storeId') storeId: string,
    @Body() body: UpdateStoreDto,
  ) {
    return await this.storeService.update(storeId, body);
  }
}
