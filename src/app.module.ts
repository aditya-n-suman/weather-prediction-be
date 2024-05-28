import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DataModule } from './data/data.module';
import { PublicApiModule } from './public-api/public-api.module';
import { CacheModule } from './cache/cache.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    DataModule,
    PublicApiModule,
    CacheModule,
  ],
})
export class AppModule {}
