import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * 리프레쉬 토큰이 유효한지 확인하기 위한 리프레쉬 가드 생성
 */
@Injectable()
export class JwtRefreshGuard extends AuthGuard("jwt-refresh-token") {}
