import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect, Query, Headers } from "@nestjs/common";
import { UsersService } from "./users.service";
import { EmailService } from "src/email/email.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("UserAPI")
@Controller("users")
export class UsersController {
  constructor(private readonly emailService: EmailService, private readonly usersService: UsersService) {}

  // @Public()
  // @Get()
  // findAll(): Promise<User[]> {
  //   return this.usersService.findAll();
  // }

  // @Get(":username")
  // findOne(@Param("username") username: string) {
  //   return this.usersService.findByName(username);
  // }

  // redirect 주소 넘겨주기.
  // @Get(":redirect")
  // @Redirect("https://nestjs.com", 301)
  // redirect(@Query("version") version) {
  //   if (version && version === "5") {
  //     return { url: "https://docs.nestjs.com/v5/" };
  //   }
  // }

  // @Patch(":username")
  // update(@Param("username") username: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(username, updateUserDto);
  // }

  // @Delete(":username")
  // remove(@Param("username") username: string) {
  //   return this.usersService.remove(username);
  // }
}
