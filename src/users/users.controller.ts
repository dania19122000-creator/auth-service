import {
  Controller,
  Get,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from "@nestjs/cache-manager";
import { UsersService } from "./users.service";
import { USERS_CACHE_KEYS } from "./users.cache-keys";

@Controller("users")
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get()
  @CacheKey(USERS_CACHE_KEYS.LIST)
  @CacheTTL(60)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @CacheKey("users:by-id")
  @CacheTTL(60)
  findById(@Param("id") id: string) {
    return this.usersService.findById(id);
  }
}