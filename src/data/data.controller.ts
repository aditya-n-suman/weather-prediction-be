import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataService } from './data.service';
import { DataResponseDto } from './dto/data-response.dto';

@ApiTags('data')
@Controller({
  path: 'data',
  version: '1',
})
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  @ApiOperation({
    summary: 'Get data',
  })
  @ApiResponse({
    status: 200,
    description: 'Data retrieved successfully',
    type: DataResponseDto,
  })
  @ApiResponse({ status: 503, description: 'Service Unavailable' })
  async getData(@Query('city') city: string): Promise<DataResponseDto> {
    const data = await this.dataService.getData(city);
    return data;
  }

  @Post('offline')
  @ApiOperation({
    summary: 'Toggle offline mode',
    description: 'Toggle offline mode for underlying public API',
  })
  @ApiResponse({
    status: 200,
    description: 'successfully toggled the offline state',
  })
  async toggleOfflineMode() {
    await this.dataService.toggleOfflineMode();
  }
}
