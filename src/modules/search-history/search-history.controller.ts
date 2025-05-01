import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { SearchHistoryService } from './search-history.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthUser } from '@app/common/interfaces/auth-user.interface';

@ApiTags('Search History Service')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('search-history')
export class SearchHistoryController {
  constructor(private readonly searchHistoryService: SearchHistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get 10 latest search result' })
  async findAll(@Auth() auth: AuthUser) {
    return await this.searchHistoryService.findLatest(auth.id);
  }

  @Delete(':id')
  async remove(@Auth() auth: AuthUser, @Param('id') id: string) {
    return await this.searchHistoryService.remove(auth.id, id);
  }
}
