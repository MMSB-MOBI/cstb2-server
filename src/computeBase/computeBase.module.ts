import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ComputeBaseService } from './computeBase.service';

@Module({
    imports: [ConfigModule],
    exports: [ComputeBaseService]
})
export class ComputeBaseModule { }