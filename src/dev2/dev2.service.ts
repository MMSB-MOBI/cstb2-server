import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { ConfigService } from '../config/config.service';
import { ImportedTree } from './dto/dev2.dto';

@Injectable()
export class DevService2 {
    constructor(private readonly configService: ConfigService) { }

    getTree(): Promise<ImportedTree> {
        const doc = "maxi_tree";
        const db = "tree";
        const tree = this.configService.request(db, doc);

        // const errors = await validate(tree);
        // if (errors.length > 0) {
        //     console.log('Validation failed: ', errors);
        // }

        return tree
    }
}