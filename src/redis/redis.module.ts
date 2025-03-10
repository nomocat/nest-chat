import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const redisHost = process.env.REDIS_HOST || 'localhost'; // 默认值为 localhost
        const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10); // 默认端口 6379
        const redisDatabase = parseInt(process.env.REDIS_DB || '0', 10); // 默认数据库 0

        const client = createClient({
            socket: {
                host: redisHost,
                port: redisPort,
                // reconnectStrategy: (retries) => Math.min(retries * 50, 2000) // 设置重连策略
            },
            database: redisDatabase
        });
        await client.connect();
        return client;
      }
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}
