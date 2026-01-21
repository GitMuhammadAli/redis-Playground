# Redis Playground

A Node.js playground for learning and experimenting with Redis using the ioredis client.

## Unique Configuration

This project uses a **unique Redis configuration** to avoid conflicts with other Redis instances:

| Service       | Port  | Description                    |
|---------------|-------|--------------------------------|
| Redis Server  | 6381  | Main Redis server (not 6379)   |
| RedisInsight  | 5540  | Web UI for Redis management    |

Container name: `redis-playground-stack`

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Docker](https://www.docker.com/)

## Quick Start

### 1. Start Redis with RedisInsight UI

```bash
npm run redis:up
```

This starts:
- **Redis Server** on `localhost:6381`
- **RedisInsight UI** on `http://localhost:5540`

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file (optional - defaults work out of the box):

```bash
cp .env.example .env
```

### 4. Test Connection

```bash
npm run redis:ping
# Expected output: PONG
```

### 5. Run Examples

```bash
# Basic connection test
npm run run:client

# String operations and key scanning
npm run run:string

# Comprehensive data structures demo
npm run run:bike

# Full Redis tutorial (strings, hashes, lists, sets, sorted sets, queues)
npm run run:queue
```

## RedisInsight Web UI

Access the Redis GUI at: **http://localhost:5540**

### First-time Setup:
1. Open http://localhost:5540 in your browser
2. Click "Add Redis Database"
3. Enter connection details:
   - **Host**: `host.docker.internal` (or `172.17.0.1` on Linux)
   - **Port**: `6379` (internal container port)
   - **Name**: `Redis Playground`
4. Click "Add Redis Database"

Alternatively, use the external connection:
- **Host**: `127.0.0.1`
- **Port**: `6381`

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run redis:up` | Start Redis Stack container with RedisInsight |
| `npm run redis:down` | Stop and remove Redis container |
| `npm run redis:ping` | Test Redis connection |
| `npm run redis:cli` | Open Redis CLI in the container |
| `npm run redis:logs` | View Redis container logs |
| `npm run run:client` | Run basic connection test |
| `npm run run:string` | Run string operations example |
| `npm run run:bike` | Run data structures demo |
| `npm run run:queue` | Run comprehensive Redis tutorial |

## Project Structure

```
├── .env                 # Environment configuration
├── .env.example         # Example environment file
├── redisClient.js       # Shared Redis client configuration
├── client.js            # Basic connection test
├── string.js            # String operations & key scanning
├── bike.js              # Data structures demo
├── stack-qeue.js        # Comprehensive Redis tutorial
├── package.json         # Project dependencies & scripts
└── README.md            # This file
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_HOST` | `127.0.0.1` | Redis server host |
| `REDIS_PORT` | `6381` | Redis server port |
| `REDIS_URL` | `redis://127.0.0.1:6381` | Full Redis connection URL |

## Redis Data Types Covered

The examples cover all major Redis data types:

### 1. Strings
- `SET`, `GET`, `MSET`, `MGET`
- `INCR`, `DECR`, `INCRBY`, `DECRBY`
- `SETNX`, `APPEND`
- TTL with `EX` option

### 2. Hashes
- `HSET`, `HGET`, `HGETALL`, `HMGET`
- `HINCRBY`, `HINCRBYFLOAT`
- `HEXISTS`, `HKEYS`, `HVALS`, `HDEL`

### 3. Lists
- `LPUSH`, `RPUSH`, `LPOP`, `RPOP`
- `LRANGE`, `LLEN`, `LINDEX`
- `LSET`, `LINSERT`, `LREM`
- `LTRIM`, `LMOVE`

### 4. Sets
- `SADD`, `SMEMBERS`, `SISMEMBER`
- `SCARD`, `SRANDMEMBER`, `SPOP`
- `SINTER`, `SUNION`, `SDIFF`

### 5. Sorted Sets
- `ZADD`, `ZSCORE`, `ZRANK`, `ZREVRANK`
- `ZRANGE`, `ZREVRANGE`, `ZRANGEBYSCORE`
- `ZINCRBY`, `ZCOUNT`, `ZCARD`

### 6. Key Management
- `EXISTS`, `TYPE`, `RENAME`, `DEL`
- `EXPIRE`, `TTL`, `PERSIST`
- `SCAN` for safe iteration

## Queue Patterns

The `stack-qeue.js` demonstrates common queue patterns:

| Pattern | Commands | Use Case |
|---------|----------|----------|
| FIFO Queue | `RPUSH` + `LPOP` | Job queues, task processing |
| LIFO Stack | `LPUSH` + `LPOP` | Undo history, backtracking |
| Capped List | `LPUSH` + `LTRIM` | Activity feeds, logs |
| Reliable Queue | `LMOVE` | Safe message processing |

## Troubleshooting

### Port already in use
If port 6381 or 5540 is already in use:

```bash
# Stop the container
npm run redis:down

# Check what's using the port (Windows)
netstat -ano | findstr :6381

# Check what's using the port (Linux/Mac)
lsof -i :6381
```

### Container already exists
```bash
# Remove existing container
docker rm -f redis-playground-stack

# Start fresh
npm run redis:up
```

### Connection refused
1. Ensure Docker is running
2. Check if container is running: `docker ps`
3. View logs: `npm run redis:logs`

## Dependencies

- [ioredis](https://github.com/redis/ioredis) - Redis client for Node.js
- [dotenv](https://github.com/motdotla/dotenv) - Environment variable management

## License

ISC
