import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as path from "path";
import { AuthModule } from "./auth/auth.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/passsport/jwt-auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { DatabaseModule } from "./database/database.module";
import { LoggerMiddleware } from "./logger.middleware";
import { join } from "path";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { UsersModule } from "./users/users.module";
import emailConfig from "./config/email.config";

// providers: nest injector에 의해 인스턴스화되고 모듈에서 공유되는 provider
// controller: 인스턴스화해야하는 컨트롤러 세트
// imports: 이 모듈에 필요한 공급자의 모듈 목록
// exports: 모든 모듈은 자동적으로 모든 모듈에서 재사용할 수 있는 공유 모듈이 되는데, 이 모듈의 인스턴스를 다른 모듈에서 사용할 수 있도록 지정
@Module({
  imports: [
    // 동적 모듈 = ConfigModule의 forRoot 메서드는 DynamicModule을 리턴하는 정적 메서드임
    ConfigModule.forRoot({
      isGlobal: true,
      load: [emailConfig],
      envFilePath:
        process.env.NODE_ENV === "production"
          ? ".production.env"
          : ".development.env",
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: "maindatabase",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log("===== write [.env] by config: network====");
        console.log(config.get("email"));
        console.log(__dirname);
        return {
          ...config.get("email"),
          template: {
            dir: path.join(__dirname, "/templates/"),
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    AuthModule,
    DatabaseModule,
    UsersModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule implements NestModule {
  constructor(private connection: Connection) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("/users");
  }
}
