import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ImportedTree } from './dto/taxonomyTree.dto';
// import { NotFoundException } from './interfaces/taxonomyTree.interface'
// import { validate } from 'class-validator';

@Injectable()
export class TaxonomyTreeService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getTree(): Promise<ImportedTree> {
        const doc = "maxi_tree";
        const db = "tree";
        try {
            var tree = await this.databaseService.requestTree(db, doc);
        } catch (err) {
            try {
                if (err.scope = 'socket') {
                    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
                    // throw new NotFoundException();
                }
            } catch (error) {
                console.log(error);
            }
        }
        return tree;

        // const errors = await validate(tree);
        // if (errors.length > 0) {
        //     console.log('Validation failed: ', errors);
        // }        
    }
}