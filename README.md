
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

## Archivo .env
```bash
//Server
PORT=3000
//Database (Railway / local)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
//JWT
JWT_SECRET=change_me
JWT_EXPIRES=1h
/Mail (Resend)
MAIL_FROM=no-reply@vivac.app
RESEND_API_KEY=change_me
//Frontend
FRONTEND_URL=http://localhost:5173
//Google OAuth
GOOGLE_CLIENT_ID=change_me
//Cloudinary
CLOUDINARY_CLOUD_NAME=change_me
CLOUDINARY_API_KEY=change_me
CLOUDINARY_API_SECRET=change_me
//Weather API
WEATHER_API_KEY=change_me
```

## Setup del proyecto

Configuración de PostgreSQL en local (Windows)

Para ejecutar el backend en local es necesario disponer de una base de datos PostgreSQL en tu equipo.
En producción, la base de datos está alojada en Railway.

### 1. Instalación de PostgreSQL

- Descarga e instala PostgreSQL desde la web oficial:  https://www.postgresql.org/download/windows/

- Durante la instalación:

- Selecciona los siguientes componentes:

PostgreSQL Server

pgAdmin 4 (opcional, pero recomendable)

Command Line Tools

- Mantén el puerto por defecto 5432

- Anota la contraseña del usuario postgres

- Cualquier versión reciente de PostgreSQL (14 o superior) es compatible, este proyecto ha sido probado con PostgreSQL 17.

### 2. Comprobar que PostgreSQL está en ejecución

- Asegúrate de que el servicio de PostgreSQL está arrancado.

- En Windows:

- Pulsa Win + R

- Escribe services.msc y pulsa Enter

- Busca el servicio postgresql-x64-XX

- Comprueba que su estado sea En ejecución

### 3. Añadir PostgreSQL al PATH del sistema

- Para poder utilizar el comando psql desde la consola, añade PostgreSQL al PATH del sistema.

- Abre las Variables de entorno del sistema

- En Variables del sistema, edita la variable Path

- Añade la ruta donde se instaló PostgreSQL, por ejemplo: C:\Program Files\PostgreSQL\17\bin

- Guarda los cambios

- Puede ser necesario reiniciar el sistema

### 4. Crear la base de datos por línea de comandos

- Pulsa Win

- Escribe cmd

- Abre Símbolo del sistema

- Ejecuta el siguiente comando: psql -U postgres

- Introduce la contraseña configurada durante la instalación (los caracteres no se mostrarán al escribir)

- Una vez dentro de psql, crea la base de datos con el comando: CREATE DATABASE vivac;

### 5. Configurar la variable DATABASE_URL

- En el archivo .env del proyecto, configura la conexión a la base de datos local:
- Sustituye TU_PASSWORD por la contraseña del usuario postgres.
```bash
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/vivac
```

```bash
Nota sobre el esquema de la base de datos

En entorno de desarrollo, TypeORM genera automáticamente las tablas a partir de las entidades del proyecto al arrancar la aplicación.

No es necesario crear tablas manualmente.
```
```bash

```

## Compilar y ejecutar el proyecto

```bash
# (la primera vez solamente)
npm install

# modo desarrollo (recomendado)
npm run start:dev

# modo estándar
npm run start
```

## Run tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Despliegue

El backend está desplegado en **Railway**.

El despliegue se realiza automáticamente al hacer push a la rama principal del repositorio.

Las variables de entorno se configuran desde el panel de Railway.

