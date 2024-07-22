import { Module } from '@nestjs/common';
import { InventoryVariantsModule } from './inventory_variants/inventory_variants.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    InventoryVariantsModule,
    AuthModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'], // Ruta al archivo .env que contiene las variables de entorno
      isGlobal: true, // indica que las variables de entorno son globales
    }),
    TypeOrmModule.forRoot({
      // linea para agregar conexión con certificado ssl
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl:
          process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null,
      },
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      autoLoadEntities: true,
      synchronize: true, //en producción no se activa
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
