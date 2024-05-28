import { Injectable } from '@nestjs/common';
import { PublicApiService } from '../public-api/public-api.service';
import { CacheService } from '../cache/cache.service';
import {
  PublicApiData,
  WeatherForecast,
} from 'src/public-api/dto/public-api.dto';
import {
  DataResponseDto,
  ResponseData,
  TempSummary,
  Weather,
} from './dto/data-response.dto';
import {
  rainIdRange,
  suggestionSet,
  thunderstormIdRange,
  tooHotTemperature,
  tooWindyLimit,
} from 'src/shared/suggestionRules';
import { KELVIN_CELSIUS_OFFSET } from 'src/shared/constants';

@Injectable()
export class DataService {
  private isOffline = false;

  constructor(
    private readonly publicApiService: PublicApiService,
    private readonly cacheService: CacheService,
  ) {}

  private kelvinToCelsius(value: number) {
    return parseFloat((value - KELVIN_CELSIUS_OFFSET).toFixed(2));
  }

  private predictionPerDay(data: WeatherForecast[], timezone: number): Weather {
    const date = new Date(data[0].dt * 1000 + timezone).toISOString();
    let {
      main: { temp_min: minTemp, temp_max: maxTemp },
    } = data[0];
    const hourlyDistribution: TempSummary[] = [];
    let tooWindy = false,
      thunderStorm = false,
      rainy = false;
    let suggestion;
    data.forEach(({ main: { temp_min, temp_max }, dt, weather, wind }) => {
      if (temp_min < minTemp) minTemp = temp_min;
      if (temp_max > maxTemp) maxTemp = temp_max;
      const summary = {} as TempSummary;
      summary.startTime = new Date(dt * 1000 + timezone).toISOString();
      summary.min = this.kelvinToCelsius(temp_min);
      summary.max = this.kelvinToCelsius(temp_max);
      summary.icon = weather[0].icon;
      summary.weather = weather[0].description;
      hourlyDistribution.push(summary);

      // checks for suggestion
      if (!tooWindy && wind.speed > tooWindyLimit * 0.44704) tooWindy = true;
      if (
        !thunderStorm &&
        weather[0].id > thunderstormIdRange.min &&
        weather[0].id < thunderstormIdRange.max
      ) {
        thunderStorm = true;
      }
      if (
        !rainy &&
        weather[0].id > rainIdRange.min &&
        weather[0].id < rainIdRange.max
      ) {
        rainy = true;
      }
    });
    if (this.kelvinToCelsius(maxTemp) > tooHotTemperature)
      suggestion = suggestionSet['tooHot'];
    if (rainy) suggestion = suggestionSet['rain'];
    if (tooWindy) suggestion = suggestionSet['tooWindy'];
    if (thunderStorm) suggestion = suggestionSet['thunderStorm'];
    return {
      date,
      minTemp: this.kelvinToCelsius(minTemp),
      maxTemp: this.kelvinToCelsius(maxTemp),
      suggestion,
      hourlyDistribution,
    };
  }

  private convertData(data: PublicApiData): ResponseData {
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
    if (listRaw) {
      const days: WeatherForecast[][] = [];
      let recentDate = new Date(listRaw[0].dt * 1000 + timezone)
        .toISOString()
        .split('T')[0];
      let currentList: WeatherForecast[] = [];
      listRaw.forEach((item) => {
        if (
          recentDate ===
          new Date(item.dt * 1000 + timezone).toISOString().split('T')[0]
        ) {
          currentList.push(item);
        } else {
          days.push(currentList);
          currentList = [item];
          recentDate = new Date(item.dt * 1000 + timezone)
            .toISOString()
            .split('T')[0];
        }
      });
      if (days.length < 4) days.push(currentList);

      response.temperatures = days.map((day) =>
        this.predictionPerDay(day, timezone),
      );
    }

    return response;
  }

  async toggleOfflineMode() {
    this.isOffline = !this.isOffline;
    return {
      code: 200,
      data: `status is changed to ${this.isOffline ? 'offline' : 'online'}`,
    };
  }

  async getData(city: string): Promise<DataResponseDto> {
    if (!this.isOffline) {
      try {
        const apiData = await this.publicApiService.fetchData(city);

        if (apiData?.cod === '200') {
          const formattedData = this.convertData(apiData);
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
