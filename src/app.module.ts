import { Module } from '@nestjs/common';
import { ComputeSpecificModule } from './computeSpecific/computeSpecific.module';
import { ComputeAllModule } from './computeAll/computeAll.module';
import { RestoreModule } from './restore/restore.module';
import { TaxonomyTreeModule } from './taxonomyTree/taxonomyTree.module';
import { DownloadController } from './download/download.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { ManagerModule } from 'nest-job-manager';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    TaxonomyTreeModule,
    ComputeSpecificModule,
    ComputeAllModule,
    RestoreModule,
    DatabaseModule,
    ManagerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'static/www'),
      exclude: ['/dev*', '/compute*'],
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [],
  controllers: [DownloadController],
})
export class AppModule {}
