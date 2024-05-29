import { Module } from '@nestjs/common';
import { PublicApiService } from './public-api.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  providers: [PublicApiService, ConfigService],
  exports: [PublicApiService],
})
export class PublicApiModule {}
