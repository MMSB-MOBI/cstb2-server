import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { TaxonomyTreeController } from './taxonomyTree.controller';
import { TaxonomyTreeService } from './taxonomyTree.service';

@Module({
  imports:[DatabaseModule, ConfigModule],
  controllers: [TaxonomyTreeController],
  providers: [TaxonomyTreeService],
})
export class TaxonomyTreeModule {}
