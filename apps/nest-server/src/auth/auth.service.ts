import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

// username과 password를 통해 인증을 진행
// 한번 인증되었다면 서버는 특정 request에서 인증 상태를 확인하기 위해 jwt를 발급
// 유효한 jwt를 가지고 있는 request만 접근할 수 있는 protected routes를 생성

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
        ){}
    // user를 검색하고 패스워드가 맞는지 확인해서 반환함
    async validateUser(username: string, password:string): Promise<any> {
        const user = await this.userService.findOne(username);
        if(user && user.password === password){
            const { password, ...result } = user;
            // result는 password 를 제외한 user의 모든 정보를 포함한다.
            return result;
        }
        return null;
    }

    async login(user:any){
        const payload = {username: user.username, sub:user.userid};
        return {access_token: this.jwtService.sign(payload)};
    }
}
