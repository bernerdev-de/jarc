import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SetupMiddleware } from './setup.middleware';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SetupMiddleware)
      .exclude(
        { path: 'setup', method: RequestMethod.ALL },
        { path: 'auth/setup', method: RequestMethod.ALL },
        { path: '_static*', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
