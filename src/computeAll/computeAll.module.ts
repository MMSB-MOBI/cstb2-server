import { Module } from '@nestjs/common';
import { ComputeAllService } from './computeAll.service';
import { ComputeAllGateway } from './computeAll.gateway';
import { ManagerModule } from '../manager/manager.module';

@Module({
    imports: [ManagerModule],
    providers: [ComputeAllGateway, ComputeAllService],
})
export class ComputeAllModule { }