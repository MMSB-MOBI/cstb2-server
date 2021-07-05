import { Module } from '@nestjs/common';
import { ComputeGateway } from './compute.gateway';
import { ComputeService } from './compute.service';

@Module({
  providers: [ComputeGateway, ComputeService],
})
export class ComputeModule { }