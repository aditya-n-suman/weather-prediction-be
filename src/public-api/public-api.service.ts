import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { PublicApiData } from 'src/public-api/dto/public-api.dto';
import { ConfigService } from '@nestjs/config';
import { API_URL } from 'src/shared/constants';

@Injectable()
export class PublicApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async fetchData(city: string): Promise<PublicApiData | null> {
    const APP_ID = this.configService.get<string>('APP_ID');
    const response = await firstValueFrom(
      this.httpService.get<PublicApiData | null>(
        `${API_URL}?q=${city}&appid=${APP_ID}&cnt=40`,
      ),
    );
    return response.data;
  }
}
