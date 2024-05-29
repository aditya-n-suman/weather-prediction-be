import { WeatherForecast } from 'src/public-api/dto/public-api.dto';
import { AlertConditionStrategy } from './alert-condition.strategy';
import { kelvinToCelsius } from 'src/shared/utils';

export class HighTemperatureStrategy implements AlertConditionStrategy {
  checkCondition(dayWeather: WeatherForecast[]): string | null {
    for (const day of dayWeather) {
      if (kelvinToCelsius(day.main.temp_max) > 40) {
        return 'Use sunscreen lotion';
      }
    }
    return null;
  }
}
