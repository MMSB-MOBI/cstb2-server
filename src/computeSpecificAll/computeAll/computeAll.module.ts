import { Module } from '@nestjs/common';
import { ComputeAllService } from './computeAll.service';
import { ComputeAllGateway } from './computeAll.gateway';
import { ManagerModule } from '../../manager/manager.module';
import { ConfigModule } from '@nestjs/config';
import { ComputeBaseService } from '../../computeBase/computeBase.service';

@Module({
    imports: [ManagerModule, ConfigModule],
    providers: [ComputeAllGateway,
        ComputeAllService,
        {
            provide: ComputeBaseService,
            useClass: ComputeAllService, // Extends ComputeService
        }
    ],
})
export class ComputeAllModule { }