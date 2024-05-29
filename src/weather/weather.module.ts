import { Module } from '@nestjs/common';
import { DataService } from './weather.service';
import { DataController } from './weather.controller';
import { CacheModule } from '../cache/cache.module';
import { PublicApiModule } from '../public-api/public-api.module';
import { AlertModule } from 'src/alert/alert.module';

@Module({
  imports: [CacheModule, PublicApiModule, AlertModule],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
