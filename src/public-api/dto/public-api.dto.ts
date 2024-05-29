export interface PublicApiData {
  cod: string;
  message: number;
  cnt?: number;
  list?: WeatherForecast[];
  city?: City;
}

export interface WeatherForecast {
  dt: number;
  main: WeatherOverview;
  weather: WeatherSummary[];
  clouds: Cloudiness;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
  rain?: Rain;
  snow?: Snow;
}

export interface WeatherOverview {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface WeatherSummary {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Cloudiness {
  all: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Sys {
  pod: string;
}

export interface Rain {
  '3h': number;
}

export interface Snow {
  '3h': number;
}

export interface City {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface Coordinates {
  lat: number;
  lon: number;
}
