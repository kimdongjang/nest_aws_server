import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [ClientsModule.register([
    {
      name: AUTH_SERVICE_NAME,
      transport: Transport.TCP,
      options: {
        url: '0.0.0.0:50051',
        package: AUTH_PACKAGE_NAME,
        protoPath: 'node_modules/grpc-nest-proto/proto/auth.proto',
      },
    },
  ]),],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
