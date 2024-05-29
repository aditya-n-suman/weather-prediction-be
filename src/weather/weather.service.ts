import { Injectable } from '@nestjs/common';
import { PublicApiService } from '../public-api/public-api.service';
import { CacheService } from '../cache/cache.service';
import { PublicApiData } from 'src/public-api/dto/public-api.dto';
import {
  BaseResponse,
  DataResponseDto,
  ResponseData,
} from './dto/weather-response.dto';
import { categorizeByDay, formatDayWeather } from 'src/shared/utils';
import { AlertService } from 'src/alert/alert.service';

@Injectable()
export class DataService {
  private isOffline = false;

  constructor(
    private readonly publicApiService: PublicApiService,
    private readonly cacheService: CacheService,
    private alertService: AlertService,
  ) {}

  private processWeatherData(data: PublicApiData) {
    const { city: cityRaw, list: listRaw } = data;
    const response = {} as ResponseData;
    let timezone: number = 0;
    if (cityRaw) {
      timezone = cityRaw.timezone * 1000;
      response.city = {
        name: cityRaw.name,
        country: cityRaw.country,
        timezone: cityRaw.timezone,
      };
    }
    const forecastsByDay = categorizeByDay(timezone, listRaw);
    response.forecasts = forecastsByDay.slice(0, 4).map((day) => {
      const alerts = this.alertService.generateAlerts(day);
      const formattedWeather = formatDayWeather(day, timezone);
      return {
        ...formattedWeather,
        alerts,
      };
    });

    return response;
  }

  async toggleOfflineMode(): Promise<BaseResponse> {
    this.isOffline = !this.isOffline;
    return {
      code: 200,
      message: `status is changed to ${this.isOffline ? 'offline' : 'online'}`,
    };
  }

  async getData(city: string): Promise<DataResponseDto> {
    if (!this.isOffline) {
      try {
        const apiData = await this.publicApiService.fetchData(city);

        if (apiData?.cod === '200') {
          const formattedData = this.processWeatherData(apiData);
          await this.cacheService.set(city, formattedData);
          return { code: 200, data: formattedData };
        }
        throw new Error('No data returned');
      } catch (error) {
        console.error('error in getting data', error);
        return {
          code: 500,
          message: 'Some error occurred in data fetching',
        };
      }
    }
    const result = await this.cacheService.get(city);
    if (result) return { code: 200, data: result };
    return {
      code: 404,
      data: result,
    };
  }
}
