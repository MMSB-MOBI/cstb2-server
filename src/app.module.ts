import { Module } from '@nestjs/common';
// import { DevModule } from './dev/dev.module';
// import { ComputeModule } from './compute/compute.module';
import { ComputeModule2 } from "./compute2/compute2.module"
import { DevModule2 } from "./dev2/dev2.module"
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  // imports: [DevModule, ComputeModule,
  imports: [DevModule2, ComputeModule2,
   ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'static'),
      exclude: ['/dev*', '/compute*'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}