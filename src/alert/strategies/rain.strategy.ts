import { WeatherForecast } from 'src/public-api/dto/public-api.dto';
import { AlertConditionStrategy } from './alert-condition.strategy';

export class RainStrategy implements AlertConditionStrategy {
  checkCondition(dayWeather: WeatherForecast[]): string | null {
    for (const day of dayWeather) {
      if (day.rain) {
        return 'Carry umbrella';
      }
    }
    return null;
  }
}
