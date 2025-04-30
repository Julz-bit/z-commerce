import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Headers,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { StoreOwnerGuard } from '../store/guards/store-owner.guard';
import { ApiPaginationQuery } from '@app/common/decorators/api-pagination-query.decorator';
import { PaginationProductDto } from './dto/pagination-product.dto';
import { ApiStoreHeader } from '@app/common/decorators/api-store-header.decorator';
import { createVariantDto } from './dto/create-variant.dto';
import { AnyFilesInterceptor, File } from '@nest-lab/fastify-multer';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { formatErrors } from '@app/utils/format-error';
import { VariantDto } from './dto/variant.dto';
import { ApiVariantBody } from '@app/common/decorators/api-variant-body.decorator';

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
    @Body() body: CreateProductDto,
  ) {
    return await this.productService.create(storeId, body);
  }

  @Post('variants/:id')
  @UseGuards(StoreOwnerGuard)
  @UseInterceptors(AnyFilesInterceptor({ preservePath: true }))
  @ApiStoreHeader()
  @ApiVariantBody()
  async createVariants(
    @Headers('x-store-id') storeId: string,
    @Param('id') id: string,
    @Body() body: { variants: string },
    @UploadedFiles() files: File[],
  ) {
    const variants = JSON.parse(body.variants) as VariantDto[];
    const dto = plainToInstance(createVariantDto, { variants });
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException({ errors: formatErrors(errors) });
    }
    return await this.productService.createVariants(
      id,
      storeId,
      variants,
      files,
    );
  }

  @Get('store')
  @UseGuards(StoreOwnerGuard)
  @ApiStoreHeader()
  @ApiPaginationQuery()
  async findAll(
    @Headers('x-store-id') storeId: string,
    @Query() query: PaginationProductDto,
  ) {
    return await this.productService.findByStore(storeId, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }
}
