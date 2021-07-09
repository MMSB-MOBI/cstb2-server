import { Injectable } from '@nestjs/common';
import { ImportedTree } from '../taxonomyTree/dto/taxonomyTree.dto';
// import { ConfigService } from "@nestjs/config"

@Injectable()
export class DatabaseService {
    // private user: string;
    // private password: string;
    // private port: number;
    // private url: string;
    // private address: string;
    // private database: string;
    private readonly nanoHandler?: any;
    
    constructor(/* private configService: ConfigService */) {
        // this.user = configService.get("user");
        // this.password = configService.get("password");
        // this.port = configService.get("db.port");
        // this.url = configService.get("url");
        // this.address = configService.get("address");
        // this.database = configService.get("database");

        // const _url: string = `http://${this.user}:${this.password}@${this.url}:${this.port}`;
        const _url = 'https://admin:admin@localhost:5984'
        this.nanoHandler = require('nano')(_url);
    };

    requestTree(db: string, doc: string): Promise<ImportedTree> {
        // const _url: string = `http://${this.user}:${this.password}@${this.url}:${this.port}`;
        const _url = 'https://admin:admin@localhost:5984'
        const nano = require('nano')(_url);
        return new Promise((res, rej) => {
            nano.request({ db, doc }, (err, data) => {
                if (err) { rej(err); return }
                res(data)
            })
        })
    }
}