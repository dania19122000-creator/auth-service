import {
  Injectable,
  OnModuleDestroy,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

@Injectable()
export class DatabaseService
  implements OnModuleDestroy
{
  public readonly db;
  private readonly pool: Pool;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.pool = new Pool({
      host: configService.get("DB_HOST"),
      port: Number(configService.get("DB_PORT")),
      user: configService.get("DB_USER"),
      password: configService.get("DB_PASSWORD"),
      database: configService.get("DB_NAME"),
    });

    this.db = drizzle(this.pool);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}