import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataService } from './weather.service';
import { BaseResponse, DataResponseDto } from './dto/weather-response.dto';

@ApiTags('weather')
@Controller({
  path: 'weather',
  version: '1',
})
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Weather Forecasts',
    description:
      'Get weather forecasts for today and next 3 days of every 3 hours',
  })
  @ApiResponse({
    status: 200,
    description: 'Data retrieved successfully',
    type: DataResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Data not found',
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Error in data fetching',
    type: BaseResponse,
  })
  async getData(@Query('city') city: string): Promise<DataResponseDto> {
    const data = await this.dataService.getData(city);
    return data;
  }

  @Get('offline')
  @ApiOperation({
    summary: 'Toggle offline mode',
    description: 'Toggle offline mode for underlying public API',
  })
  @ApiResponse({
    status: 200,
    description: 'successfully toggled the offline state',
    type: BaseResponse,
  })
  async toggleOfflineMode() {
    const response = await this.dataService.toggleOfflineMode();
    return response;
  }
}
