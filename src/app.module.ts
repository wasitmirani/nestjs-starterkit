import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
       TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'nest_auth_db',
      autoLoadEntities: true,
      logging: true,      // optional: log queries
      synchronize: false, // NOTE: set false in production
        // Explicitly disable running migrations from the app runtime.
        // We're using `synchronize` for development-only DB operations
        // and we don't want the app to create or run migration files.
        migrationsRun: false,
        migrations: [],
    }),
    UsersModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
