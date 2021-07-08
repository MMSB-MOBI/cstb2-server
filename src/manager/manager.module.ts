import { Module } from "@nestjs/common";
import { ManagerService } from './manager.service'
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [ManagerService],
    exports: [ManagerService],
})

export class ManagerModule { }