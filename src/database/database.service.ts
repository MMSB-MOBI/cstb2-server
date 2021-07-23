import { Injectable } from '@nestjs/common';
import { ImportedTree } from '../taxonomyTree/dto/taxonomyTree.dto';
import { ConfigService } from "@nestjs/config"

@Injectable()
export class DatabaseService {
    private user: string;
    private password: string;
    private port: number;
    private host: string;
    private url: string;
    private readonly nanoHandler?: any;

    constructor(private configService: ConfigService) {
        console.log(configService.get('db.couchDB.connect'));
        
        const { user, password, host, port } = configService.get('db.couchDB.connect');
        this.user = user;
        this.password = password;
        this.host = host;
        this.port = port;

        this.url = `http://${this.user}:${this.password}@${this.host}:${this.port}`;
        this.nanoHandler = require('nano')(this.url);
    };

    requestTree(db: string, doc: string): Promise<ImportedTree> {
        return new Promise((res, rej) => {
            this.nanoHandler.request({ db, doc }, (err, data) => {
                if (err) { rej(err); return; }
                res(data);
            })
        })
    }
}