import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { join } from 'path';
import * as express from 'express';
import { IoAdapter } from '@nestjs/platform-socket.io';
// import * as cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true
  })
  
  // socket
  app.useWebSocketAdapter(new IoAdapter(app));

  app.use(express.json());
  app.setGlobalPrefix('/api/v1/');
  app.use('/files', express.static(join(__dirname, '..', 'files')));

  app.useGlobalPipes(
    new ValidationPipe({
      validatorPackage: require('@nestjs/class-validator'),
      transformerPackage: require('class-transformer'),
      transform: true,
      forbidUnknownValues: false,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TRACKING APPS API')
    .setDescription('Base url: /api/v1')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/docs', app, document, {
    customSiteTitle: 'TRACKING APPS API DOCS',
    customfavIcon:
      'https://www.mandirikartukredit.com/uploads/media/merchant/key-visual-hot-offer/default/key-visual-hot-offer/asian-golf--logo-150x150.jpg',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });

  await app.listen(8080);
}

// async function socket() {
//   const app = await NestFactory.create(AppModule);

//   // socket
//   app.useWebSocketAdapter(new IoAdapter(app))
//   app.listen(3027)
//   // await app.listen(8081, () => {
//   //   console.log('WebSocket server is running on http://localhost:8081');
//   // });
// }

bootstrap();
// socket();
