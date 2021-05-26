import { Module } from '@nestjs/common';
import { DevModule } from './dev/dev.module';
import { ComputeModule } from './compute/compute.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [DevModule, ComputeModule,
   ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'static'),
      exclude: ['/dev*', '/compute*'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}