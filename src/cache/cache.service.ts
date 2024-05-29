import { Injectable } from '@nestjs/common';
import { ResponseData } from 'src/weather/dto/weather-response.dto';

type CacheData = Record<string, ResponseData>;

@Injectable()
export class CacheService {
  private cache: CacheData = {};

  async get(key: string): Promise<ResponseData | null> {
    const entry = this.cache[key];
    return entry;
  }

  async set(key: string, value: ResponseData): Promise<void> {
    this.cache[key] = value;
  }

  async del(key: string): Promise<void> {
    delete this.cache[key];
  }

  async getAll() {
    return this.cache;
  }
}
