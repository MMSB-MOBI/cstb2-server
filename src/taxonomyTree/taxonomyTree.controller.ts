import { Controller, Get } from '@nestjs/common';
import { TaxonomyTreeService } from './taxonomyTree.service';
import { ImportedTree } from './dto/taxonomyTree.dto';

@Controller()
export class TaxonomyTreeController {
  constructor(private readonly taxonomyService: TaxonomyTreeService) { }

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

    return this.taxonomyService.getTree();
  }
}