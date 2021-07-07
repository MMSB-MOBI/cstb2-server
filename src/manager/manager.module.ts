import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { ManagerService } from './manager.service'

const jobManagerFactory = {
    provide: 'JOBMANAGER',
    useFactory: (/* configModule: ConfigModule */) => {
        return new ManagerService(1234, "127.0.0.1" /* configModule.get('port'), configModule.get('TCPip') */);
    },
    inject: [/* ConfigModule */],
};

@Global()
@Module({
    //controllers: [ManagerController],
    providers: [jobManagerFactory],
    exports: ['JOBMANAGER'],
})

export class ManagerModule { }