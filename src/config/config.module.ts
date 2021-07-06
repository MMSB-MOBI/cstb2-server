import { Module, Global } from '@nestjs/common';
/*import { ConfigController } from './config.controller';*/
import { ConfigService } from './config.service';

@Global()
@Module({
    //controllers: [ConfigController],
    providers: [ConfigService],
    exports: [ConfigService],
})

export class ConfigModule {
    getNano() {
        const nano = require('nano')('http://admin:admin@localhost:5984');
        return nano }
}