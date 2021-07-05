import { Injectable } from '@nestjs/common';

@Injectable()
export class DevService2 {
    getTree(): Promise<string> {
        console.log("Get tree");
        const nano = require('nano')('http://admin:admin@localhost:5984');
        const doc = "maxi_tree";
        const db = "tree";
        return new Promise((res, rej) => {
            nano.request({ db, doc }, (err, data) => {
                if (err) { rej(err); return }
                res(data)
            })
        })
    }
}