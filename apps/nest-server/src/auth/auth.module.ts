import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UsersModule } from "src/users/users.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_ACCESS_TOKEN_SECRET"),
        signOptions: {
          expiresIn: `${configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")}s`,
        },
      }),
    }),
    UsersModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, JwtRefreshStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
