import { Injectable } from '@nestjs/common';
import { ImportedTree } from '../dev2/dto/dev2.dto';

@Injectable()
export class ConfigService {
    private readonly url = "http://admin:admin@localhost:5984";
    private readonly port = 5984;
    private readonly nanoHandler?: any;
    constructor() {
        console.log("INVOKED");
        // this.nanoHandler = require(....)
    };

    request(db: string, doc: string): Promise<ImportedTree> {
        const nano = require('nano')('http://admin:admin@localhost:5984');
        return new Promise((res, rej) => {
            nano.request({ db, doc }, (err, data) => {
                if (err) { rej(err); return }
                res(data)
            })
        })
    }
}