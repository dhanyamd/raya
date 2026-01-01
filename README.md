API Nexus is a high-performance, open-source API development platform. Built with a cutting-edge tech stack, it provides a unified interface for testing RESTful APIs and debugging real-time WebSockets with zero friction.

🚀 Key Capabilities
📡 Advanced WebSocket Debugger
Bi-directional Streaming: Connect to ws:// or wss:// with a persistent, low-latency handshake.

Real-time Event Log: Track every outgoing and incoming message with precise timestamps.

Connection Lifecycle: Visual indicators for Connecting, Open, Closing, and Closed states.

Payload Support: Send structured JSON or raw text messages instantly.

🛠️ REST API Orchestrator
Method Diversity: Support for the full HTTP spectrum (GET, POST, PUT, PATCH, DELETE).

Dynamic Context: Manage complex request headers and query parameters via an intuitive key-value interface.

Body Editor: Built-in support for Raw JSON payloads with automatic syntax validation.

Response Analytics: Instant feedback on Status Codes, Response Time (ms), and Payload Size.

🎨 Developer Experience (DX)
State Persistence: Powered by Zustand to ensure your work stays put even after a refresh.

Responsive Dark Mode: A sleek, "midnight" inspired UI built with TailwindCSS and shadcn/ui.

Clean Architecture: Modular folder structure designed for easy scaling and contributions.

🛠️ Technical Architecture
Core: Next.js 15 (App Router & Server Actions)

Logic: TypeScript (Strict Mode)

Real-time: ws for Node.js WebSocket implementation

Styling: TailwindCSS + shadcn/ui

State: Zustand (Client-side) & TanStack Query (Server-state)

Icons: Lucide-React

🏁 Quick Start
1. Installation
Bash

git clone https://github.com/YourUsername/api-nexus.git
cd api-nexus
npm install
2. Configure Environment
Create a .env.local file:

Code snippet

NEXT_PUBLIC_WS_SERVER=ws://localhost:8080
DATABASE_URL="your-postgresql-url"
3. Launch the Ecosystem
Start the WebSocket server:

Bash

node server/index.js
Start the Next.js development environment:

Bash

npm run dev
📂 Project Roadmap
Plaintext

/app
  ├── (dashboard)      # Main testing interface
  ├── api              # Next.js API Routes
/components
  ├── ui               # shadcn/ui base components
  ├── ws-panel         # WebSocket specific logic
  ├── rest-panel       # HTTP request logic
/hooks                 # Custom hooks for socket management
/lib                   # Utility functions & API clients