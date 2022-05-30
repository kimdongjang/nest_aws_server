import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { config } from "dotenv";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import process from "process";

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:4939/auth/google/callback",
      scope: ["email", "profile"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      name: name,
      accessToken,
      refreshToken,
    };

    // 로그인이 안되어있으면 회원가입하는 로직
    // if (!user) {
    //   user = await this.usersService.create({
    //     provider: 'google',
    //     providerId: id,
    //     name: name.givenName,
    //     username: emails[0].value,
    //   });
    // }

    done(null, user);
  }
}
