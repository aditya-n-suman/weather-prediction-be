import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { CacheModule } from '../cache/cache.module';
import { PublicApiModule } from '../public-api/public-api.module';

@Module({
  imports: [CacheModule, PublicApiModule],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
