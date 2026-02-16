## Client (Dev) — Docker Compose

npm create vite@latest client -- --template react-swc

### Objectif

Lancer le front **client** en mode développement dans Docker avec :

- code monté en bind mount (hot reload)
- `node_modules` isolé dans un **named volume** (évite `vite: not found` et les problèmes de permissions)

### Volumes retenus

- `./client:/app` → le code du client est monté dans le container
- `node_modules_client:/app/node_modules` → les dépendances restent dans Docker (pas sur l’hôte)

### Lancer

```bash
docker compose -f docker-compose.dev.yml up --build
```
