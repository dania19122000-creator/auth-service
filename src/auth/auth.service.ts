import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(
    username: string,
    password: string,
    fullName: string
  ) {
    const passwordHash = await bcrypt.hash(password, 10);

    return this.usersService.createUser(
      username,
      passwordHash,
      fullName
    );
  }

  async login(username: string, password: string) {
    const user =
      await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException(
        "Invalid credentials"
      );
    }

    const isValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isValid) {
      throw new UnauthorizedException(
        "Invalid credentials"
      );
    }

    const token = this.jwtService.sign({
      sub: user.id,
    });

    return { accessToken: token };
  }

  async me(token: string) {
    if (!token) {
      throw new UnauthorizedException(
        "Missing token"
      );
    }

    return this.jwtService.verify(token);
  }
}