import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

async function bootstrap() {
  const keyFile = fs.readFileSync('/certs/cstb-dev_ibcp_fr.key');
  const certFile = fs.readFileSync('/certs/cstb-dev_ibcp_fr_full.pem');
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: keyFile,
      cert: certFile,
    },
  });
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get('app.port');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
