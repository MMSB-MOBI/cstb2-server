import { Module } from '@nestjs/common';
import { TreeController } from './compute2.gateway';
import { TreeService } from './compute2.service';

@Module({
    imports:[],
    controllers: [TreeController],
    providers: [TreeService],
})
export class TreeModule {}