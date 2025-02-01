WEB_DIR = cd ./packages/web

run:
	docker compose up -d
	${WEB_DIR} && pnpm run dev
