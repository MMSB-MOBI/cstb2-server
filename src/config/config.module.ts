import config from './config_parameters';
import { Module } from '@nestjs/common';

// @Module({
//     providers: [
//         {
//             provide: 'CONFIG',
//             useValue: config,
//         },
//     ],
// })

@Module({
    providers: [
        {
            provide: 'TCPip',
            useValue: "127.0.0.1",
        },
        {
            provide: 'port',
            useValue: 1234
        }
    ],
})

export class ConfigModule { }