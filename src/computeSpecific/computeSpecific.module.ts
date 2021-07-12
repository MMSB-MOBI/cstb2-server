import { Module } from '@nestjs/common';
import { ComputeSpecificService } from './computeSpecific.service';
import { ComputeSpecificGateway } from './computeSpecific.gateway';
import { ManagerModule } from '../manager/manager.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ManagerModule, ConfigModule],
    providers: [ComputeSpecificGateway, ComputeSpecificService],
})
export class ComputeSpecificModule { }