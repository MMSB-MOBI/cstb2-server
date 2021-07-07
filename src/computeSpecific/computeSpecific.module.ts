import { Module } from '@nestjs/common';
import { ComputeSpecificService } from './computeSpecific.service';
import { ComputeSpecificGateway } from './computeSpecific.gateway';
import { ManagerModule } from '../manager/manager.module';

@Module({
    imports: [ManagerModule],
    providers: [ComputeSpecificGateway, ComputeSpecificService],
})
export class ComputeSpecificModule { }