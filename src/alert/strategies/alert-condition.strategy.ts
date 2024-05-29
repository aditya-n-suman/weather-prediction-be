import { WeatherForecast } from 'src/public-api/dto/public-api.dto';

export interface AlertConditionStrategy {
  checkCondition(dayWeather: WeatherForecast[]): string | null;
}
