import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "auth",
        transport: Transport.GRPC,
        options: {
          package: "auth",
          protoPath: join(__dirname, "/proto/auth.proto"),
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
