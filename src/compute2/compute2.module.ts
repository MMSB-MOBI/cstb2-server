import { Module } from '@nestjs/common';
import { ComputeService2 } from './compute2.service';
import { ComputeGateway2 } from './compute2.gateway';

@Module({
    providers: [ComputeGateway2, ComputeService2],
})
export class ComputeModule2 { }