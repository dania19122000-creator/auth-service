import {
  Body,
  Controller,
  Post,
  Get,
  Headers,
  UnauthorizedException
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(
      dto.username,
      dto.password,
      dto.fullName
    );
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(
      dto.username,
      dto.password
    );
  }

  @Get("me")
  me(@Headers("authorization") auth?: string) {
    if (!auth) {
      throw new UnauthorizedException(
        "Missing Authorization header"
      );
    }

    const token = auth.replace("Bearer ", "");
    return this.authService.me(token);
  }
}