import { Controller, Get } from '@nestjs/common';
import { DevService } from './dev.service';

@Controller()
export class DevController {
  constructor(private readonly devService: DevService) {}

  @Get()
  getHello(): string {
    return this.devService.getHello();
  }

  @Get('/dev/tree')
  getTree(): Promise<string> {
    return this.devService.getTree();
  }
}