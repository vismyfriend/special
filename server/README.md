# server/ — свой бэкенд special-agents-vue2

Совместим с бэкендом Егорчика (тот же контракт эндпоинтов).

## Стек
- Node.js + Express (CommonJS)
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`)
- `cors`, `dotenv`

## Эндпоинты (контракт 1-в-1 с Егорчиком)
| Метод | URL | Auth | Тело / query |
|---|---|---|---|
| POST | `/auth` | нет | `{ username }` → `{ token }` |
| GET | `/scores` | JWT | `?game=X` (опц.) |
| POST | `/scores` | JWT | `{ game, time, mistakes, agent, wordSet }` |
| GET | `/health` | нет | — |
| GET | `/test` | нет | — |
| GET | `/db` | нет | — |

## Запуск локально
```bash
cd server
npm install
cp .env.example .env   # отредактируй под себя
psql english_app < schema.sql
npm run dev
