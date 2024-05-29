import { Injectable } from '@nestjs/common';
import { AlertConditionStrategy } from './strategies/alert-condition.strategy';
import { HighTemperatureStrategy } from './strategies/high-temperature.strategy';
import { RainStrategy } from './strategies/rain.strategy';
import { HighWindStrategy } from './strategies/high-wind.strategy';
import { ThunderstormStrategy } from './strategies/thunderstorm.strategy';
import { WeatherForecast } from 'src/public-api/dto/public-api.dto';

@Injectable()
export class AlertService {
  private strategies: AlertConditionStrategy[];

  constructor() {
    this.strategies = [
      new RainStrategy(),
      new HighWindStrategy(),
      new ThunderstormStrategy(),
      new HighTemperatureStrategy(),
    ];
  }

  generateAlerts(dayWeather: WeatherForecast[]): string[] {
    return this.strategies
      .map((strategy) => strategy.checkCondition(dayWeather))
      .filter((alert) => alert !== null) as string[];
  }
}
