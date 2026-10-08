# 🎬 Live Movie Hub

A real-time web application featuring **live movie notifications** (SSE) and **watch party chat rooms** (WebSocket), built with modern technologies.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=flat&logo=socketdotio&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

---

## 📖 Table of Contents

- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Setup & Run](#-setup--run)
- [Features](#-features)
- [Written Answers](#-written-answers)
- [Screenshots](#-screenshots)

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                 │
│                                                              │
│  ┌─────────────────────┐    ┌──────────────────────────────┐ │
│  │  Notification Feed  │    │     Watch Party Chat         │ │
│  │  (EventSource API)  │    │    (WebSocket API)           │ │
│  │  Redux: events,     │    │    Redux: messages, users,   │ │
│  │  toasts, status     │    │    connectionStatus          │ │
│  └─────────┬───────────┘    └──────────────┬───────────────┘ │
└────────────│───────────────────────────────│─────────────────┘
             │ SSE (one-way)                 │ WebSocket (two-way)
             ▼                               ▼
┌──────────────────────────────────────────────────────────────┐
│                     SERVER (Node.js + Express)               │
│                                                              │
│  ┌─────────────────────┐    ┌──────────────────────────────┐ │
│  │  SSE Service        │    │  WebSocket Server (ws)       │ │
│  │  GET /api/events    │    │  Room management             │ │
│  │  POST /api/announce │    │  Message broadcasting        │ │
│  │  Heartbeat (20s)    │    │  Ping/pong heartbeat         │ │
│  │  Auto event (5s)    │    │  Rate limiting (5/10s)       │ │
│  └─────────────────────┘    └──────────────┬───────────────┘ │
│                                            │                 │
│  ┌─────────────────────────────────────────▼───────────────┐ │
│  │              MongoDB (Persistence)                      │ │
│  │  GET /api/rooms/:room/messages (last 20)                │ │
│  │  Save all chat messages                                 │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
live-movie-hub/
├── server/                         # Backend
│   ├── src/
│   │   ├── config/db.js            # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── sseController.js    # SSE stream & announce handlers
│   │   │   └── roomController.js   # Chat room message history
│   │   ├── services/
│   │   │   ├── sseService.js       # SSE client management & broadcasting
│   │   │   ├── chatService.js      # Message persistence (MongoDB)
│   │   │   └── movieService.js     # Mock movie event generator
│   │   ├── models/Message.js       # Mongoose message schema
│   │   ├── routes/
│   │   │   ├── sseRoutes.js        # GET /api/events, POST /api/announce
│   │   │   └── roomRoutes.js       # GET /api/rooms/:room/messages
│   │   ├── middleware/rateLimiter.js # Sliding window rate limiter
│   │   ├── validators/messageValidator.js # WebSocket message validation
│   │   ├── websocket/wsServer.js   # WebSocket server with rooms
│   │   └── app.js                  # Express app setup
│   ├── tests/messageValidator.test.js # Unit tests
│   ├── index.js                    # Server entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── client/                         # Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             # Header, MobileNav
│   │   │   ├── notifications/      # NotificationFeed, Card, Toast, Badge, AnnounceForm
│   │   │   └── chat/               # JoinRoom, ChatWindow, MessageList, MessageInput, etc.
│   │   ├── store/                  # Redux Toolkit (store, notificationSlice, chatSlice)
│   │   ├── hooks/                  # useSSE, useWebSocket custom hooks
│   │   ├── utils/sanitize.js       # XSS sanitization with DOMPurify
│   │   ├── App.jsx                 # Main app with responsive layout
│   │   ├── main.jsx                # Entry point with Redux Provider
│   │   └── index.css               # Tailwind CSS + custom styles
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🚀 Setup & Run

### Prerequisites

- **Node.js** v18+ 
- **MongoDB** running locally (or a MongoDB Atlas URI)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/live-movie-hub.git
cd live-movie-hub
```

### 2. Setup the backend

```bash
cd server
cp .env.example .env    # Edit .env with your MongoDB URI if needed
npm install
npm run dev             # Starts with nodemon on port 5000
```

### 3. Setup the frontend

```bash
cd client
cp .env.example .env    # Edit if your server runs on a different port
npm install
npm run dev             # Starts Vite dev server on port 5173
```

### 4. Open in browser

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

### Running tests

```bash
cd server
npm test
```

### Docker (backend only)

```bash
cd server
docker build -t live-movie-hub-server .
docker run -p 5000:5000 --env-file .env live-movie-hub-server
```

---

## ✨ Features

### Part A: Live Notifications Feed (SSE)
- ✅ `GET /api/events` SSE endpoint with `text/event-stream`
- ✅ Auto-generated movie events every 5 seconds
- ✅ `POST /api/announce` for custom broadcast messages
- ✅ Client cleanup on disconnect
- ✅ Heartbeat comment every 20 seconds
- ✅ Live feed (latest 10 events, newest on top)
- ✅ Connection status badge (Connecting / Live / Disconnected)
- ✅ Real-time notification count badge
- ✅ Toast notifications with auto-dismiss and manual dismiss
- ✅ Auto-reconnection handling via EventSource

### Part B: Watch Party Chat (WebSocket)
- ✅ WebSocket server using `ws` library
- ✅ Room-based chat with predefined + custom rooms
- ✅ Room-scoped message broadcasting
- ✅ "User joined" / "User left" system messages
- ✅ Online users count per room
- ✅ Message validation (JSON, non-empty, max 300 chars)
- ✅ Typing indicator
- ✅ Connection status badge with auto-reconnect (exponential backoff)
- ✅ Redux Toolkit slice (messages, users, connectionStatus)

### Part C: Persistence (MongoDB)
- ✅ All chat messages saved to MongoDB
- ✅ `GET /api/rooms/:room/messages` loads last 20 messages
- ✅ History loaded on room join, then live via WebSocket

### Bonus Features
- ✅ Ping/pong heartbeat on WebSocket (dead connection detection)
- ✅ Rate limiting (5 messages per 10 seconds per user)
- ✅ Unit tests for message validation (15 test cases)
- ✅ Dockerfile for backend
- ✅ XSS sanitization with DOMPurify
- ✅ Mobile-first responsive design with Tailwind breakpoints

---

## 📝 Written Answers

### 1. Why SSE for Part A and WebSocket for Part B?

**SSE (Server-Sent Events) was chosen for the notification feed** because it is inherently a one-way communication pattern — the server pushes movie updates to the client, and the client never needs to send data back over that same channel. SSE is built on top of standard HTTP, which means it works seamlessly with existing infrastructure (proxies, load balancers, firewalls) without special configuration. The browser's `EventSource` API provides automatic reconnection out of the box — if the connection drops, the browser retries without any custom code. SSE also supports event IDs, so the server can track what the client has already received and avoid duplicates on reconnect. For a read-only live feed, SSE is the simplest, most reliable choice.

**WebSocket was chosen for the chat** because chat is inherently bidirectional — users both send and receive messages in real time. WebSocket provides a full-duplex TCP connection where either side can push data at any time with minimal overhead (just 2–6 bytes per frame header vs. full HTTP headers). This makes it ideal for interactive features like typing indicators, instant message delivery, and room join/leave notifications. Unlike SSE, WebSocket allows the client to send structured messages (join, message, typing) directly over the same persistent connection, avoiding the need for separate HTTP requests. The `ws` library was used instead of Socket.IO to keep the implementation lightweight and transparent — no magic abstraction layer, making every frame visible and debuggable.

### 2. What happens if the server restarts while 100 users are connected? What did you do about it?

When the server restarts, all 100 SSE and WebSocket connections are immediately terminated. Here's what happens and how the app handles it:

**SSE connections**: The browser's `EventSource` API has built-in automatic reconnection. When the connection drops, it waits a default retry interval (usually 3 seconds) and reconnects automatically. Our UI reflects this by showing the connection badge as "Disconnected" (via the `onerror` handler), then "Connecting," then "Live" once the new connection is established. No user action is needed.

**WebSocket connections**: Unlike SSE, WebSocket has no built-in reconnection. Our `useWebSocket` hook implements **exponential backoff reconnection** — it retries at 1s, 2s, 4s, 8s, up to a maximum of 16s. The hook stores the current room and username in refs, so when the connection is re-established, it automatically sends a `join` message to rejoin the same room. The UI shows the connection status throughout this process.

**Chat history preservation**: Because all chat messages are persisted to MongoDB, no data is lost. When users reconnect and rejoin their room, the app fetches the last 20 messages from `GET /api/rooms/:room/messages`, providing continuity. The only thing lost is the "user joined/left" tracking (which is in-memory), but this rebuilds naturally as users reconnect.

### 3. What would break if you ran 2 server instances behind a load balancer? How would you fix it?

Several things would break with multiple server instances:

**SSE broadcasting would fragment**: The SSE client list is stored in-memory (`let clients = []`). If Server A has 50 clients and Server B has 50 clients, a `POST /api/announce` hitting Server A would only broadcast to its 50 clients. The other 50 connected to Server B would never receive the announcement. The simulated movie events would also only reach clients on whichever server generated them.

**WebSocket rooms would split**: Room membership is stored in an in-memory `Map`. If User A joins `room-action` on Server 1 and User B joins the same room on Server 2, they'd never see each other's messages. Each server would have its own isolated room state.

**Typing indicators and user counts would be incorrect**: Since each server only knows about its own connected users, the online count would be wrong, and typing indicators would only work between users on the same server.

**How to fix it — Redis Pub/Sub**:
1. **Replace in-memory state with Redis**: Use Redis as a shared pub/sub message broker. When Server A receives a chat message, it publishes it to a Redis channel. Server B subscribes to the same channel and broadcasts it to its local WebSocket clients.
2. **Use Redis for SSE**: Similarly, SSE events would be published to Redis so all server instances broadcast them.
3. **Sticky sessions (partial fix)**: Configure the load balancer to use sticky sessions (based on IP or cookie) so a single user always connects to the same server. This helps with WebSocket but doesn't solve cross-server broadcasting.
4. **Use an adapter**: Libraries like `@socket.io/redis-adapter` implement this pattern if using Socket.IO. For raw `ws`, you'd implement the pub/sub manually with the `ioredis` library.
5. **Store room membership in Redis**: Move the rooms Map to Redis with `SADD`/`SMEMBERS` commands, so all servers share the same view of who's in which room.

---

## 📱 Screenshots

> Add screenshots at 360px, 768px, and 1280px wide here.

| 360px (Mobile) | 768px (Tablet) | 1280px (Desktop) |
|---|---|---|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend framework & build tool |
| Tailwind CSS | Utility-first styling |
| Redux Toolkit | Global state management |
| Node.js + Express | Backend server |
| MongoDB + Mongoose | Database & ODM |
| `ws` | WebSocket server library |
| EventSource (SSE) | Server-Sent Events |
| DOMPurify | XSS sanitization |

---

## 📄 License

MIT
