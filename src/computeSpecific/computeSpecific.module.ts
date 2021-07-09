import { Module } from '@nestjs/common';
import { ComputeSpecificService } from './computeSpecific.service';
import { ComputeSpecificGateway } from './computeSpecific.gateway';
import { ManagerModule } from '../manager/manager.module';
import { ConfigModule } from '@nestjs/config';
import { ComputeService } from '../computeVirtual/computeVirtual.service';

@Module({
    imports: [ManagerModule, ConfigModule],
    providers: [ComputeSpecificGateway,
        ComputeSpecificService,
        {
            provide: ComputeService,
            useClass: ComputeSpecificService, // Extends ComputeService
        }
    ],
})
export class ComputeSpecificModule { }