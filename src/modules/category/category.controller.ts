import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { PaginationCategoryDto } from './dtos/pagination-category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginationQuery } from '@app/common/decorators/api-pagination-query.decorator';

@ApiTags('Category Service')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  async create(@Body() body: CreateCategoryDto) {
    return await this.categoryService.create(body);
  }

  @Get()
  @ApiOperation({
    summary: 'Get paginated result using cursor based pagination',
  })
  @ApiPaginationQuery()
  async findAll(@Query() query: PaginationCategoryDto) {
    return await this.categoryService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category via id' })
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  async update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return await this.categoryService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(id);
  }
}
