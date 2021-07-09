import { Module } from '@nestjs/common';
import { TaxonomyTreeController } from './taxonomyTree.controller';
import { TaxonomyTreeService } from './taxonomyTree.service';

@Module({
  imports:[],
  controllers: [TaxonomyTreeController],
  providers: [TaxonomyTreeService],
})
export class TaxonomyTreeModule {}
