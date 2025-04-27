import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Headers,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { StoreOwnerGuard } from '../store/guards/store-owner.guard';
import { ApiPaginationQuery } from '@app/common/decorators/api-pagination-query.decorator';
import { PaginationProductDto } from './dto/pagination-product.dto';
import { ApiStoreHeader } from '@app/common/decorators/api-store-header.decorator';

@ApiTags('Product Service')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(StoreOwnerGuard)
  @ApiStoreHeader()
  async create(
    @Headers('x-store-id') storeId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return await this.productService.create(storeId, createProductDto);
  }

  @Get('store')
  @UseGuards(StoreOwnerGuard)
  @ApiStoreHeader()
  @ApiPaginationQuery()
  findAll(
    @Headers('x-store-id') storeId: string,
    @Query() query: PaginationProductDto,
  ) {
    return this.productService.findByStore(storeId, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }
}
