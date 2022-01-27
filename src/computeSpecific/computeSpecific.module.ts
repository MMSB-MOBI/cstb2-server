import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ManagerModule } from 'nest-job-manager';

import { ComputeSpecificService } from './computeSpecific.service';
import { ComputeSpecificGateway } from './computeSpecific.gateway';
import { ComputeBaseService } from '../computeBase/computeBase.service';

@Module({
    imports: [ManagerModule, ConfigModule],
    providers: [ComputeSpecificGateway,
        ComputeSpecificService,
        {
            provide: ComputeBaseService,
            useClass: ComputeSpecificService,
        }
    ],
})
export class ComputeSpecificModule { }