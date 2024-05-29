import { WeatherForecast } from 'src/public-api/dto/public-api.dto';
import { KELVIN_CELSIUS_OFFSET } from './constants';
import {
  DayWeather,
  HourlyWeather,
} from 'src/weather/dto/weather-response.dto';

export const kelvinToCelsius = (value: number) => {
  return parseFloat((value - KELVIN_CELSIUS_OFFSET).toFixed(2));
};

export function formatDayWeather(
  data: WeatherForecast[],
  timezone: number,
): DayWeather {
  const date = new Date(data[0].dt * 1000 + timezone).toISOString();
  let {
    main: { temp_min: minTemp, temp_max: maxTemp },
  } = data[0];
  const hourlyDistribution: HourlyWeather[] = [];
  data.forEach(({ main: { temp_min, temp_max }, dt, weather, wind }) => {
    if (temp_min < minTemp) minTemp = temp_min;
    if (temp_max > maxTemp) maxTemp = temp_max;
    const summary = {} as HourlyWeather;
    summary.startTime = new Date(dt * 1000 + timezone).toISOString();
    summary.min = kelvinToCelsius(temp_min);
    summary.max = kelvinToCelsius(temp_max);
    summary.icon = weather[0].icon;
    summary.summary = weather[0].description;
    hourlyDistribution.push(summary);
  });
  return {
    date,
    minTemp: kelvinToCelsius(minTemp),
    maxTemp: kelvinToCelsius(maxTemp),
    hourlyDistribution,
  };
}

export function categorizeByDay(
  timezone: number,
  data?: WeatherForecast[],
): WeatherForecast[][] {
  if (data) {
    const days: WeatherForecast[][] = [];
    let recentDate = new Date(data[0].dt * 1000 + timezone)
      .toISOString()
      .split('T')[0];
    let currentList: WeatherForecast[] = [];
    data.forEach((item) => {
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

    return days;
  }

  return [];
}
