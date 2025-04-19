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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SortOrder } from '@app/common/enums/sort-order.enum';

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
  @ApiQuery({
    name: 'order',
    enum: SortOrder,
    required: true,
    example: SortOrder.ASC,
  })
  @ApiQuery({ name: 'limit', required: true, example: 20 })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(@Query() query: QueryCategoryDto) {
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
