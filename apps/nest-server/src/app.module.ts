import {Module} from '@nestjs/common';
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
    ],
    providers:[
        // {
        //     provide: APP_GUARD,
        //     useClass: JwtAuthGuard,
        // }
    ]
})
export class AppModule {}
