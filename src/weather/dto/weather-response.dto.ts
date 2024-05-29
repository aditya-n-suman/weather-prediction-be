export class BaseResponse {
  code: number;
  message?: string;
}

export class DataResponseDto extends BaseResponse {
  data?: ResponseData | null;
}

export class ResponseData {
  city: City;
  forecasts: DayWeather[];
}

export class City {
  name: string;
  country: string;
  timezone: number;
}

export class DayWeather {
  date: string;
  minTemp: number;
  maxTemp: number;
  hourlyDistribution: HourlyWeather[];
  alerts?: string[];
}

export class HourlyWeather {
  startTime: string;
  min: number;
  max: number;
  summary: string;
  icon: string;
}
