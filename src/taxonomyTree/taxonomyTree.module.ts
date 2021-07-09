import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TaxonomyTreeController } from './taxonomyTree.controller';
import { TaxonomyTreeService } from './taxonomyTree.service';

@Module({
  imports:[DatabaseModule],
  controllers: [TaxonomyTreeController],
  providers: [TaxonomyTreeService],
})
export class TaxonomyTreeModule {}
