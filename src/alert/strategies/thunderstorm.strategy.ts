import { WeatherForecast } from 'src/public-api/dto/public-api.dto';
import { AlertConditionStrategy } from './alert-condition.strategy';

export class ThunderstormStrategy implements AlertConditionStrategy {
  checkCondition(dayWeather: WeatherForecast[]): string | null {
    for (const day of dayWeather) {
      if (day.weather[0].main === 'Thunderstorm') {
        return "Don't step out! A Storm is brewing!";
      }
    }
    return null;
  }
}
