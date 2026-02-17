npm create vite@latest client -- --template react-swc

# Fullstack Docker (DEV) — Reverse Proxy + Client + API + PostgreSQL

## Architecture (DEV)

- **Reverse proxy** : Nginx (point d’entrée unique)
- **Client** : serveur dev (HMR)
- **API** : Node/Express
- **DB** : PostgreSQL

Routage :

- `/api/*` → `api:3000`
- `/*` (≠ `/api`) → `client:5173`

---

## Accès

- Front : `http://localhost:8080`
- API : `http://localhost:8080/api/*`

Endpoints utiles :

- `GET /api/health`
- `GET /api/count`

---

## Ports (DEV)

- `8080` : reverse-proxy (seul port à utiliser côté navigateur)
- `5173` : interne (client HMR)
- `3000` : interne (api)
- `5432` : Postgres (optionnel à exposer si debug)

---

## Commandes

### Lancer (build + up)

`docker compose -f docker-compose.dev.yml up --build`

### Logs

`docker compose -f docker-compose.dev.yml logs -f`

### Stop

`docker compose -f docker-compose.dev.yml down`

### Reset complet (recommandé si deps/volumes cassés)

⚠️ Supprime aussi les volumes (`node_modules`, DB si volume).
`docker compose -f docker-compose.dev.yml down -v && docker compose -f docker-compose.dev.yml up --build`

---

## Notes importantes

### 1) Nginx DEV — règle `/api`

✅ Conserve le préfixe `/api` :

- `location /api/` + `proxy_pass http://api:3000;`

❌ À éviter (strip `/api/` → `/count`) :

- `location /api/` + `proxy_pass http://api:3000/;`

### 2) node_modules

Recommandé : `node_modules` dans un **named volume** (pas en bind mount)  
→ évite `vite: not found`, problèmes de permissions, mismatch OS (macOS vs alpine).

### 3) Accès au client

Recommandé : ouvrir le front via `http://localhost:8080`  
→ `fetch("/api/...")` fonctionne sans CORS.

---

## Debug rapide

- Voir containers : `docker ps` / `docker ps -a`
- Logs container : `docker logs <container>`
- Shell container : `docker exec -it <container> sh`

######### Procédure (DEV) — Client + API + PostgreSQL

## 1) Client (Vite React SWC)

Créer le projet :

````bash
npm create vite@latest client -- --template react-swc

## 1) Client (Vite React SWC)
Créer le projet :
```bash
cd api && npm init -y
npm i express cors pg dotenv
npm i -D nodemon

Configurer package.json :
    ajouter "type": "module"

ajouter scripts :
    "dev": "nodemon server.js"
    "start": "node server.js"

Créer le fichier env :
    touch .env
    (variables utilisées)
    PORT=3000
    DATABASE_URL=postgresql://app:app@db:5432/app

### 3) PostgreSQL — création + injection SQL
# Créer la table counter + la ligne initiale (id=1) :
docker compose -f docker-compose.dev.yml exec db psql -U app -d app -c \
"CREATE TABLE IF NOT EXISTS counter (id INTEGER PRIMARY KEY, count BIGINT NOT NULL DEFAULT 0);
 INSERT INTO counter (id, count) VALUES (1, 0) ON CONFLICT (id) DO NOTHING;"

 docker compose -f docker-compose.dev.yml exec db psql -U app -d app -c "SELECT * FROM counter;"

````
