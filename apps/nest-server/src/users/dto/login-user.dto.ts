import { IsBoolean, IsEmail, IsString, Matches } from "class-validator";

export class UserLoginDto {
  @IsEmail()
  readonly email: string;
  @IsString()
  // @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
