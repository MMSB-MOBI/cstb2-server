import { Controller, Get } from '@nestjs/common';
import { DevService2 } from './dev2.service';
import { ImportedTree } from './dto/dev2.dto';

@Controller()
export class DevController2 {
  constructor(private readonly dev2Service: DevService2) { }

  @Get('/dev/tree')
  getTree(): Promise<ImportedTree> {

    // (async () => {
    //     try {
    //         const result = await this.dev2Service.getTree();
    //         return result // string and not promise<string>
    //     } catch (e) {
    //         console.log(e);
    //     }
    // })()

    return this.dev2Service.getTree();
  }
}