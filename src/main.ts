import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.enableCors({
    origin: true, // Permite todos los orígenes
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true, // Habilita las credenciales (cookies, encabezados de autenticación, etc.)
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });

  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: 'JWT_SECRET',
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  //Swagger
  const config = new DocumentBuilder()
    .setTitle('test Endpoints My SQL with NestJS')
    .setDescription('Api para testear endopoints de mysql')
    .setVersion('1.0')
    .addTag('#E-comerce')
    .setContact(
      'Eleazar Gamez',
      'https://github.com/EleazarGamezD',
      'eleazar.gamezd@gmail.com',
    )
    .addServer(`http://localhost:${process.env.PORT}`, 'Servidor Local')
    .addGlobalParameters()
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'token',
    )
    .addOAuth2({
      name: 'google',
      type: 'oauth2',
      description: 'OAuth2 with Google',
      flows: {
        implicit: {
          authorizationUrl: 'http://localhost:3001/api/oauth/google/login',
          tokenUrl: 'http://localhost:3001/api/oauth/google/callback',
          scopes: {
            'https://www.googleapis.com/auth/userinfo.profile':
              'View your profile information',
            'https://www.googleapis.com/auth/userinfo.email':
              'View your email address',
          },
        },
      },
    })
    .build();

  const swaggerOptions = {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui.min.css', //? se coloca '/' para que swagger sea la web principal !
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document, swaggerOptions);
  await app.listen(process.env.PORT);
  logger.log(`App Running on port ${process.env.PORT}`);
}

bootstrap();
