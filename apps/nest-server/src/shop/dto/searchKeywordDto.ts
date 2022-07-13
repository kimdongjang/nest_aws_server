import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsInt, IsLatitude, IsLongitude, IsNumber, IsString, Matches, Max, Min } from "class-validator";

export class SearchKeywordDto {
  @IsString()
  readonly keyword: string;
  @IsLatitude()
  readonly lat: number;
  @IsLongitude()
  readonly lng: number;
  @IsInt()
  @Type(() => Number)
  readonly radius: number;
}
