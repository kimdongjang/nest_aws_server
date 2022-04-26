import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

// 서비스의 내부 규칙에 따라 달라지게 하는 인가 기능
// ex) 가입한 요금제에 따라 서비스에서 제공하는 기능이 다르게끔 요청 객체에 포함된 정보를 분석해
// 사용자가 해당 기능을 사용할 수 있는지 판단
@Injectable()
export class CustomGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any) {
    return true;
  }
}