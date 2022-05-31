import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";

const protoDir = join(__dirname, "..", "protos");
export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: "0.0.0.0:50001",
    package: "auth",
    protoPath: "/proto/auth.proto",
    loader: {
      keepCase: true,
      longs: Number,
      enums: String,
      defaults: false,
      arrays: true,
      objects: true,
      includeDirs: [protoDir],
    },
  },
};
