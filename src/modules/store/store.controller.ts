import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AuthGuard } from '@app/modules/auth/guards/auth.guard';
import { Auth } from '@app/modules/auth/decorators/auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthInterface } from '@app/common/interfaces/auth.interface';

@ApiTags('Store Service')
@ApiBearerAuth()
@Controller('store')
@UseGuards(AuthGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new store' })
  async create(@Body() body: CreateStoreDto, @Auth() auth: AuthInterface) {
    return await this.storeService.create(body, auth.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store via id' })
  async findOne(@Param('id') id: string) {
    return await this.storeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update store' })
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(+id, updateStoreDto);
  }
}
