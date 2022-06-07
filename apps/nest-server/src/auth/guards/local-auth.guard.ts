import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * userGuards()에서 'local' 해당 이름을 참조해 로컬 전략과 일치하는 코드와 연결해준다.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {}
