import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

import jsonfile = require('jsonfile');
const program = require("commander");

@Global()
@Module({
    //controllers: [ConfigController],
    providers: [DatabaseService],
    exports: [DatabaseService],
})

export class DatabaseModule {
    getNano() {
        const nano = require('nano')('http://admin:admin@localhost:5984');
        return nano }

    getParam() {
        return jsonfile.readFileSync(program.conf);
    }
}