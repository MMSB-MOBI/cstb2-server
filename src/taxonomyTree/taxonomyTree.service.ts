import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ImportedTree } from './dto/taxonomyTree.dto';
// import { validate } from 'class-validator';

@Injectable()
export class TaxonomyTreeService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getTree(): Promise<ImportedTree> {

        const doc = "maxi_tree";
        const db = "tree";
        const tree = await this.databaseService.requestTree(db, doc);
        console.log("tree", tree);
        
        // const errors = await validate(tree);
        // if (errors.length > 0) {
        //     console.log('Validation failed: ', errors);
        // }

        return tree
    }
}