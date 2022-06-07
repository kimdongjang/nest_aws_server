import { IsBoolean, IsEmail, IsString, Matches } from "class-validator";

export class BoardWriteDto {
  @IsString()
  readonly title: string;
  @IsString()
  readonly content: string;
}
