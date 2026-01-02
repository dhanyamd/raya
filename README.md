# Raya

**Raya** is a high-performance, open-source API development platform. Built with a modern tech stack, it provides a unified interface for testing **RESTful APIs** and debugging **real-time WebSockets** with zero friction.

https://github.com/user-attachments/assets/a70a3d25-29cc-416d-8e62-68e21de0104d


---

## ✨ Features

### 📡 WebSocket Client
- **Real-time Streaming:** Connect to `ws://` or `wss://` endpoints with a persistent handshake.
- **Message Logging:** Track every outgoing and incoming message with precise timestamps.
- **Bi-directional Flow:** Send and receive JSON or raw text messages instantly.
- **Connection Logic:** Visual indicators for `Connecting`, `Open`, and `Closed` states.

### 🛠️ REST API Client
- **Full Method Support:** Execute `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` requests.
- **Dynamic Headers:** Manage complex request headers and query parameters via a key-value UI.
- **Body Editor:** Built-in support for Raw JSON payloads with automatic syntax highlighting.
- **Response Metrics:** View Status Codes, Response Time (ms), and Payload Size at a glance.

### 🎨 Modern UX/UI
- **Responsive Design:** A sleek, "dark-mode" interface built with **TailwindCSS** and **shadcn/ui**.
- **State Persistence:** Powered by **Zustand** to ensure your configurations stay put after a refresh.
- **Clean Architecture:** Modular folder structure designed for easy scaling and developer contributions.


**WEBSOCKETS** :

https://github.com/user-attachments/assets/81a039dc-c9c8-4534-b413-3e36f5e3cd72



**REST** :

https://github.com/user-attachments/assets/7ad0b742-3de0-4547-8db7-b6ac514000d5





---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Language:** TypeScript
- **Real-time:** [ws](https://github.com/websockets/ws) for Node.js WebSocket implementation
- **State Management:** Zustand
- **API Caching:** TanStack Query (v5)
- **UI Components:** shadcn/ui + TailwindCSS
- **Icons:** Lucide-react

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone [https://github.com/dhanyamd/raya](https://github.com/dhanyamd/raya)
cd raya
