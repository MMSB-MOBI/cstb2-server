import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ManagerModule } from '../manager/manager.module';

import { RestoreService } from './restore.service';
import { RestoreGateway } from './restore.gateway';

@Module({
  imports: [ManagerModule, ConfigModule],
  providers: [RestoreGateway, RestoreService],
})
export class RestoreModule {}
