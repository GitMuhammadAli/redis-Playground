# Redis Playground

A simple Node.js playground for experimenting with Redis using the ioredis client.

## Prerequisites

- Node.js
- Docker (for running Redis)

## Getting Started

### 1. Start Redis Server

Run Redis using Docker:

```bash
docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Examples

```bash
node string.js
```

## Project Structure

```
├── client.js      # Redis client configuration
├── string.js      # String operations example
└── package.json
```

## Dependencies

- [ioredis](https://github.com/redis/ioredis) - Redis client for Node.js

## License

ISC
