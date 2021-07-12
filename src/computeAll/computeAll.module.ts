import { Module } from '@nestjs/common';
import { ComputeAllService } from './computeAll.service';
import { ComputeAllGateway } from './computeAll.gateway';
import { ManagerModule } from '../manager/manager.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ManagerModule, ConfigModule],
    providers: [ComputeAllGateway, ComputeAllService],
})
export class ComputeAllModule { }