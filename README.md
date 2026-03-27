# AARAA-INFRA

## Docker setup

This project is now dockerized with 3 services:

- `frontend` (React + Nginx) on `http://localhost:5173`
- `backend` (Express + Socket.IO) on `http://localhost:5001`
- `mongo` (MongoDB) on `localhost:27017`

### Files added

- `docker-compose.yml`
- `backend/Dockerfile`
- `backend/.dockerignore`
- `frontend/Dockerfile`
- `frontend/.dockerignore`
- `frontend/nginx.conf`

### Run with Docker

From the project root:

1. (Optional) export your chatbot key for build-time injection:

	`export VITE_GROQ_API_KEY=your_key_here`

2. Build and start all services:

	`docker compose up -d --build`

3. Open the app:

	`http://localhost:5173`

4. Check logs if needed:

	`docker compose logs -f`

5. Stop:

	`docker compose down`

To remove database volume too:

`docker compose down -v`

### Notes

- Backend uses `MONGO_URI=mongodb://mongo:27017/consultancy` inside Docker.
- CORS and Socket CORS are set for `http://localhost:5173` in compose.
- Uploaded files are persisted to `backend/uploads` on your host.
