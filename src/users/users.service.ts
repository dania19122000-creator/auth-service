import {
  Injectable,
  Inject,
  Logger,
} from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { eq } from "drizzle-orm";

import { users } from "./users.schema";
import { DatabaseService } from "../db/db.service";
import { USERS_CACHE_KEYS } from "./users.cache-keys";

@Injectable()
export class UsersService {
  private readonly logger = new Logger("UsersService");

  constructor(
    private readonly database: DatabaseService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache
  ) {}

  async findAll() {
    this.logger.log("Fetching all users");
    return this.database.db.select().from(users);
  }

  async findById(id: string) {
    this.logger.log(`Fetching user by id=${id}`);

    const [user] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.id, id));

    return user;
  }

  async createUser(
    username: string,
    passwordHash: string,
    fullName: string
  ) {
    this.logger.log(`Creating user username=${username}`);

    const [user] = await this.database.db
      .insert(users)
      .values({ username, passwordHash, fullName })
      .returning();

    await this.cache.del(USERS_CACHE_KEYS.LIST);
    this.logger.warn("Invalidated users:list cache");

    return user;
  }

  async deleteUser(id: string) {
    this.logger.warn(`Deleting user id=${id}`);

    await this.database.db
      .delete(users)
      .where(eq(users.id, id));

    await this.cache.del(USERS_CACHE_KEYS.LIST);
    await this.cache.del(USERS_CACHE_KEYS.BY_ID(id));

    this.logger.warn(`Invalidated cache for user id=${id}`);
  }

  async findByUsername(username: string) {
    this.logger.log(
      `Finding user by username=${username}`
    );

    const [user] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.username, username));

    return user;
  }
}