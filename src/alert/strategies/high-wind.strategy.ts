import { WeatherForecast } from 'src/public-api/dto/public-api.dto';
import { AlertConditionStrategy } from './alert-condition.strategy';
import { MILE_PER_HOUR_TO_METER_PER_SECOND_MULTIPLIER } from 'src/shared/constants';

export class HighWindStrategy implements AlertConditionStrategy {
  checkCondition(dayWeather: WeatherForecast[]): string | null {
    for (const day of dayWeather) {
      if (day.wind.speed > 10 * MILE_PER_HOUR_TO_METER_PER_SECOND_MULTIPLIER) {
        return "It's too windy, watch out!";
      }
    }
    return null;
  }
}
