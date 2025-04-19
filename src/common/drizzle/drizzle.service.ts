import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import * as schema from '@app/common/drizzle/schema';

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  private pool: Pool;
  private db: ReturnType<typeof drizzle<typeof schema>>;

  constructor(private readonly config: ConfigService) {
    const databaseUrl = this.config.get<string>('DATABASE_URL');
    this.pool = new Pool({ connectionString: databaseUrl });
    this.db = drizzle(this.pool, { schema });
  }

  get client() {
    return this.db;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
