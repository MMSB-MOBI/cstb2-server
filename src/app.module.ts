import { Module } from '@nestjs/common';
import { DevModule } from './dev/dev.module';
import { ComputeModule } from './compute/compute.module';
import { ComputeSpecificModule } from "./computeSpecific/computeSpecific.module"
import { ComputeAllModule } from "./computeAll/computeAll.module"
import { TaxonomyModule } from "./taxonomyTree/taxonomyTree.module"
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { ManagerModule } from './manager/manager.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  // imports: [DevModule, ComputeModule,
  imports: [TaxonomyModule, ComputeSpecificModule, ComputeAllModule, DatabaseModule, ManagerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'static'),
      exclude: ['/dev*', '/compute*'],
    }),
    ConfigModule.forRoot({
      load: [configuration]
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }