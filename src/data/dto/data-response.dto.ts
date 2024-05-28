export class DataResponseDto {
  code: number;
  message?: string;
  data?: ResponseData | null;
}

export class ResponseData {
  city: City;
  temperatures: Weather[];
}

export class City {
  name: string;
  country: string;
  timezone: number;
}

export class Weather {
  date: string;
  minTemp: number;
  maxTemp: number;
  hourlyDistribution: TempSummary[];
  suggestion?: Suggestion;
}

export class Suggestion {
  msg: string;
  icon: string;
}

export class TempSummary {
  startTime: string;
  min: number;
  max: number;
  weather: string;
  icon: string;
}
