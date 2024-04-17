import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ManagerModule } from 'nest-job-manager';

import { ComputeAllService } from './computeAll.service';
import { ComputeAllGateway } from './computeAll.gateway';
import { ComputeBaseService } from '../computeBase/computeBase.service';

@Module({
  imports: [ManagerModule, ConfigModule],
  providers: [
    ComputeAllGateway,
    ComputeAllService,
    {
      provide: ComputeBaseService,
      useClass: ComputeAllService,
    },
  ],
})
export class ComputeAllModule {}
