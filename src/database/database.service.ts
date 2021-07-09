import { Injectable } from '@nestjs/common';
import { ImportedTree } from '../taxonomyTree/dto/taxonomyTree.dto';
import { ConfigService } from "@nestjs/config"

@Injectable()
export class DatabaseService {
    private user: string;
    private password: string;
    private port: number;
    private local: string;
    private url: string;
    private address: string;
    private database: string;
    private readonly nanoHandler?: any;

    constructor(private configService: ConfigService) {
        console.log("config service", configService.get("db.user"));

        this.user = configService.get("db.user");
        this.password = configService.get("db.password");
        this.port = configService.get("db.port");
        this.local = configService.get("url");
        this.address = configService.get("address");
        this.database = configService.get("db.database");

        // this.url = 'https://admin:admin@localhost:5984'
        this.url = `http://${this.user}:${this.password}@${this.local}:${this.port}`;
        this.nanoHandler = require('nano')(/* "https://admin:admin@localhost:5984" */ this.url);
    };

    requestTree(db: string, doc: string): Promise<ImportedTree> {

        console.log("url", this.url);

        return new Promise((res, rej) => {
            this.nanoHandler.request({ db, doc }, (err, data) => {
                if (err) { rej(err); return }
                res(data)
            })
            console.log("request couch db");

        })
    }
}