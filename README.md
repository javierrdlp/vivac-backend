
<p align="center" style="background-color:#ffffff; padding:20px; border-radius:12px;">
  <img width="294" height="148" alt="WildSpot logo" src="https://github.com/user-attachments/assets/a03be7d1-ac63-4206-a100-296292fef187" />
</p>

# 🌄 Wild Spot – Backend

Backend API para la plataforma **Vivac / Wild Spot**, orientada a la gestión y descubrimiento de puntos de vivac.

Desarrollado con **NestJS**, **TypeORM** y **PostgreSQL**.

## Descripción

API para Wild Spot, una plataforma para descubrir, crear y compartir la experencia de hacer vivac.

Funcionalidades de la API:
- Autenticación de usuario (JWT & Google OAuth)
- Gestión de usuarios
- Gestión de puntos de vivac
- Sistema de carpetas organizadoras de puntos vivac
- Puntuaciones y reseñas
- Sistema de seguidores
- Logros y xp de usuario
- API del clima integrada (Weather API)
- API de subida y alojamientos de imágenes (Cloudinary)

## Tech Stack

Backend

- NestJS (framework para Node.js)

- TypeScript

- TypeORM

Base de datos

- PostgreSQL

Autenticación

- JWT (access y refresh tokens)

- Google OAuth 2.0

Servicios externos

- Cloudinary API (subida y optimización de imágenes)

- WeatherAPI (información meteorológica)

Infraestructura

- Railway (hosting del backend y la base de datos)

## Clonar el proyecto

Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/javierrdlp/vivac-backend.git
cd vivac-backend
```

## Variables de entorno

Este proyecto requiere un archivo `.env` para su correcto funcionamiento.

Las variables incluyen:
- Configuración del servidor
- Conexión a base de datos PostgreSQL
- Autenticación JWT
- Integración con Google OAuth
- Envío de correos (Resend)
- Subida de imágenes con Cloudinary
- Información meteorológica

Crea un archivo `.env` en la raíz del proyecto basándote en los ejemplos más abajo.

> Nota: **no subas** el archivo `.env` al repositorio.

**Server**
- PORT=3000

**Database (Railway / local)**
- DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME

**JWT**
- JWT_SECRET=change_me
- JWT_EXPIRES=1h

**Mail (Resend)**
- MAIL_FROM=no-reply@vivac.app
- RESEND_API_KEY=change_me

**Frontend**
- FRONTEND_URL=http://localhost:5173

**Google OAuth**
- GOOGLE_CLIENT_ID=change_me

**Cloudinary**
- CLOUDINARY_CLOUD_NAME=change_me
- CLOUDINARY_API_KEY=change_me
- CLOUDINARY_API_SECRET=change_me

**Weather API**
- WEATHER_API_KEY=change_me


## Setup del proyecto

```bash
$ npm install
```

## Compilar y ejecutar el proyecto

```bash
# modo desarrollo (recomendado)
npm run start:dev

# modo estándar
npm run start
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
