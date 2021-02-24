import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import * as session from 'express-session';
import { randomBytes } from 'crypto';

async function bootstrap() {
  if (!process.env.PASSWORD_PEPPER)
    process.env.PASSWORD_PEPPER = "";

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static'), {
    prefix: '/_static',
  });
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'templates', 'partials'));
  app.setBaseViewsDir(join(__dirname, '..', 'templates'));
  app.use(
    session({
      secret: process.env.SECRET || randomBytes(32).toString('hex'),
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(3000);
}
bootstrap();
