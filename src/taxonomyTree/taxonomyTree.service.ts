import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ImportedTree } from './dto/taxonomyTree.dto';
import { ConfigService } from "@nestjs/config"
// import { NotFoundException } from './interfaces/taxonomyTree.interface'
// import { validate } from 'class-validator';

@Injectable()
export class TaxonomyTreeService {
    constructor(
        private readonly databaseService: DatabaseService,
        private configService: ConfigService
        ) { }

    async getTree(): Promise<ImportedTree> {
        const doc = this.configService.get('db.couchDB.maxi_tree.doc');        
        const db = this.configService.get('db.couchDB.maxi_tree.database');
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