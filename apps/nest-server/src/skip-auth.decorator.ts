import { SetMetadata } from "@nestjs/common";

// jwt guard로 인한 접근제한과 다르게 공개된 경로로 접근할 수 있도록 custom decoreator 설정
export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
