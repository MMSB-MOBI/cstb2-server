import { Module } from '@nestjs/common';
import { DevController2 } from './dev2.controller';
import { DevService2 } from './dev2.service';

@Module({
  imports:[],
  controllers: [DevController2],
  providers: [DevService2],
})
export class DevModule2 {}
