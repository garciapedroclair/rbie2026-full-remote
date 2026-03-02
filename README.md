# 🚀 Deployment on Ubuntu

This guide explains how to deploy the application using **Docker** on an Ubuntu environment.

---

## 🐳 Install Docker

Run the installation script:

```bash
chmod +x ./infra/install_docker.sh
./infra/install_docker.sh
```

> 💡 This script installs Docker and Docker Compose automatically.

---

## ⚙️ Configure Environment Variables

In the `client` folder, create a `.env` file based on the provided example:

```bash
cd client/
cp .env.example .env
```
---

## 🧱 Start the Application (DEV MOD)

```bash
sudo docker compose up --build -d
```

> 🧩 This command starts all services (Client and Server) as defined in the `docker-compose.yml` file.

---