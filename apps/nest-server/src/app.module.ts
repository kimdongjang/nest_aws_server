import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {MailerModule} from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import {ConfigModule, ConfigService} from '@nestjs/config';
import configEmail from './config/email';
import * as path  from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constatns';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { CatsService } from './cats/cats.service';
import { CatsController } from './cats/cats.controller';
import { CatsModule } from './cats/cats.module';
import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from './logger.middleware';

// providers: nest injector에 의해 인스턴스화되고 모듈에서 공유되는 provider
// controller: 인스턴스화해야하는 컨트롤러 세트
// imports: 이 모듈에 필요한 공급자의 모듈 목록
// exports: 모든 모듈은 자동적으로 모든 모듈에서 재사용할 수 있는 공유 모듈이 되는데, 이 모듈의 인스턴스를 다른 모듈에서 사용할 수 있도록 지정
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configEmail],
        }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                console.log('===== write [.env] by config: network====');
                console.log(config.get('email'));
                console.log(__dirname)
                return {
                    ...config.get('email'),                
                    template: {
                        dir: path.join(__dirname, '/templates/'),
                        adapter: new EjsAdapter(),
                        options: {
                        strict: true,
                        },
                    },
                };
            },
        }),
        UserModule,
        AuthModule,
        CatsModule,
        DatabaseModule,
    ],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(LoggerMiddleware)
          .forRoutes('cats');        
    }
}
