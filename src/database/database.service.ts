import { Injectable } from '@nestjs/common';
import { ImportedTree } from '../taxonomyTree/dto/taxonomyTree.dto';
import { ConfigService } from "@nestjs/config"

@Injectable()
export class DatabaseService {
    private user: string;
    private password: string;
    private port: number;
    private host: string;
    private database: string;
    private url: string;
    private readonly nanoHandler?: any;

    constructor(private configService: ConfigService) {
        this.user = configService.get("db.couchDB.user");
        this.password = configService.get("db.couchDB.password");
        this.port = configService.get("db.couchDB.port");
        this.host = configService.get("db.couchDB.host");
        this.database = configService.get("db.couchDB.database");
        this.url = `http://${this.user}:${this.password}@${this.host}:${this.port}`;
        this.nanoHandler = require('nano')(this.url);
    };

    requestTree(db: string, doc: string): Promise<ImportedTree> {
        return new Promise((res, rej) => {
            this.nanoHandler.request({ db, doc }, (err, data) => {
                if (err) { rej(err); return }
                res(data)
            })
        })
    }
}