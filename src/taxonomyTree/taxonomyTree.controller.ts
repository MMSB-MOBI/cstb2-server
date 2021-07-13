import { Controller, Get } from '@nestjs/common';
import { TaxonomyTreeService } from './taxonomyTree.service';
import { ImportedTree } from './dto/taxonomyTree.dto';
import { ConfigService } from '@nestjs/config';

@Controller()
export class TaxonomyTreeController {
  private database: string
  private route: string

  constructor(
    private readonly taxonomyService: TaxonomyTreeService,
    private readonly configService: ConfigService) {
      this.database = configService.get("db.couchDB.database");
      this.route = `/dev/${this.database}`
    }

  @Get('/dev/tree') // this.route
  getTree(): Promise<ImportedTree> {
    try {
      return this.taxonomyService.getTree();
    } catch (err) {
      console.log(err);      
    }
  }
}