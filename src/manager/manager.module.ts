import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { ManagerService } from './manager.service'

// const jobManagerFactory = {
//     provide: 'JOBMANAGER',
//     useFactory: (configModule: ConfigModule) => {
//         return new ManagerService(/* configModule.get('port'), configModule.get('TCPip') */);
//     },
//     inject: [/* ConfigModule */],
// };

// @Global()
@Module({
    //controllers: [ManagerController],
    imports: [ConfigModule],
    providers: [ManagerService /* jobManagerFactory */],
    // exports: ['JOBMANAGER'],
})

export class ManagerModule { }