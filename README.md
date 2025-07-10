# Dockerized Services with Caddy Reverse Proxy

This project provides a modular Docker setup for multiple services, all routed through a central Caddy reverse proxy with automatic HTTPS. Each service is managed independently in its own directory and connected via a shared Docker network.

## Project Structure

```
/docker
  /caddy         # Caddy reverse proxy (entry point for all web traffic)
  /v2ray         # V2Ray VPN server (WebSocket over TLS)
  /draftly       # Draftly SPA frontend
  /openvpn       # OpenVPN server
  README.md
```

## Shared Docker Network
All services that need to be accessible via Caddy are connected to a shared external Docker network called `web`. This allows Caddy to reverse proxy to any service by its Docker Compose service name.

---

## 1. Caddy (Reverse Proxy & TLS)

- **Location:** `caddy/`
- **Purpose:** Handles HTTPS, automatic certificate management, and reverse proxying for all domains/services.
- **Config:** Edit `caddy/Caddyfile` to add or update site blocks for each domain/service.
- **Network:** Connects to the shared `web` network.

### Example Caddyfile blocks:
```
v2ray.ermolaev-frontend.ru {
  reverse_proxy v2ray:10000
  encode gzip
}

draftly.ermolaev-frontend.ru {
  reverse_proxy draftly:80
  encode gzip
}
```

### Setup
```sh
cd caddy
# Start or restart Caddy
docker-compose up -d
```

---

## 2. V2Ray (VPN Server)

- **Location:** `v2ray/`
- **Purpose:** Provides a secure VPN server using the VMess protocol over WebSocket+TLS.
- **Config:** Edit `v2ray/config.json` to manage users (UUIDs) and settings.
- **Network:** Connects to the shared `web` network.

### Setup
```sh
cd v2ray
docker-compose up -d
```

### Client Configuration
- **Address:** v2ray.ermolaev-frontend.ru
- **Port:** 443
- **UUID:** YOUR_UUID_HERE
- **Network:** ws
- **WebSocket Path:** /v2ray
- **TLS:** enabled

---

## 3. Draftly (SPA Frontend)

- **Location:** `draftly/`
- **Purpose:** Runs the Draftly SPA frontend in a Docker container.
- **Config:** `draftly/docker-compose.yml`
- **Network:** Connects to the shared `web` network.

### Setup
```sh
cd draftly
docker-compose up -d
```
- Accessible at: https://draftly.ermolaev-frontend.ru

---

## 4. OpenVPN (VPN Server)

- **Location:** `openvpn/`
- **Purpose:** Provides an OpenVPN server using the `kylemanna/openvpn` image.
- **Config:** `openvpn/docker-compose.yml`
- **Network:** (Optional) Add to `web` if you want to reverse proxy via Caddy.

### Setup
```sh
cd openvpn
# Initialize config (run once):
docker volume create --name=ovpn_data
docker run -v ovpn_data:/etc/openvpn --rm kylemanna/openvpn ovpn_genconfig -u udp://YOUR_SERVER_IP
docker run -v ovpn_data:/etc/openvpn --rm -it kylemanna/openvpn ovpn_initpki
# Start the server:
docker-compose up -d
```

---

## Shared Network Setup

Create the shared network (once):
```sh
docker network create web
```

Ensure each service's `docker-compose.yml` includes:
```yaml
networks:
  web:
    external: true
```
And the service is attached to the `web` network.

---

## General Tips
- **Caddy is your main entry point for all web traffic and HTTPS.**
- **Each service is managed independently.**
- **Add new services by connecting them to the `web` network and adding a Caddyfile block.**
- **Monitor containers with `docker ps`, `docker stats`, or logs.**

---
For more help, see the official documentation for each service or ask for specific examples!
