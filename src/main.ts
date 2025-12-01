import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // quita propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // lanza error si se envía algo no permitido
      transform: true, // transforma tipos automáticamente 
    }),
  );

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('Vivac API')
    .setDescription('Documentación de la API de VivacApp (entorno desarrollo)')
    .setVersion('1.0')
    .addBearerAuth() //permite probar endpoints con token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

