# Tradehub

This is a full-stack application built with Vue.js 3 for the frontend and Node.js for the backend to buy and sell products. The application is designed to run in a Docker environment using Docker Compose.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:

```
git clone https://github.com/rajesh6666/tradehub
cd tradehub
```

2. Build and run the containers:

```
docker compose up -d
```

This command will build the Docker images and start the containers for the frontend and backend services.

3. Next run migrations for the backend:
```
docker exec -it tradehub-api-1 node ace migration:run
```
4. You can now access the app on:
```
http://localhost:5173
```

## Project Structure

```
your-repo/
├── api/
│   ├── ...
│   └── package.json
├── app/
│   ├── ...
│   └── package.json
├── docker-compose.yml
└── README.md
```

- `api/`: This folder contains the AdonisJS 6 backend code.
- `app/`: This folder contains the Vue.js 3 frontend code.
- `docker-compose.yml`: The Docker Compose configuration file.

## Frontend Development

To develop the frontend, navigate to the `app` directory and start the development server:

```
cd app
npm install
npm run serve
```

The frontend will be available at `http://localhost:5173`.

## Backend Development

To develop the backend, navigate to the `api` directory and start the AdonisJS server:

```
cd api
npm install
npm run dev
```

The backend will be available at `http://localhost:3333`.

## Production Build

To build the production versions of the frontend and backend, run the following commands:

```
# Build frontend
cd app
npm run build

# Build backend
cd ../api
node ace build
```

The production-ready files will be generated in the respective `dist` or `build` folders.

## Docker Compose Commands

- `docker compose up -d`: Build and start the containers.
- `docker-compose down`: Stop and remove the containers.
- `docker-compose logs`: View the logs for the containers.