import { ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "src/skip-auth.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  //기본 오류 처리 및 인증 논리를 확장하는 것 외에도 인증이 일련의 전략을 거치도록 허용할 수 있습니다
  //성공, 리디렉션 또는 오류에 대한 첫 번째 전략은 체인을 중지합니다. 인증 실패는 일련의 각 전략을 통해 진행되며 모든 전략이 실패하면 궁극적으로 실패합니다.
  // export class JwtAuthGuard extends AuthGuard(['strategy_jwt_1', 'strategy_jwt_2', '...']) { ... }
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    console.log("1. canActive 호출 ");
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      console.log("1-1. canActive 결과 : true ");
      return true;
    }
    return super.canActivate(context);
  }
  handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
    console.log("4. handleRequest 호출 ");
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
