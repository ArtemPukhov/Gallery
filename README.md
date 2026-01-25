# Передвижники — галерея

Проект сайта-галереи с возможностью выбрать художника и смотреть его работы.
Next.js (App Router) + TypeScript + Tailwind CSS. Данные — локально в TS-модуле.

## Команды

```bash
npm install
npm run dev
npm run build
npm run start
```

## Docker (production)

Сборка образа:

```bash
docker build -t peredvizhniki-gallery .
```

Запуск контейнера:

```bash
docker run --rm -p 3000:3000 peredvizhniki-gallery
```

## GitHub Actions + GHCR

В репозитории добавлен workflow: `.github/workflows/docker.yml`.
Он собирает приложение и публикует Docker-образ в GitHub Container Registry.

После пуша в `main`/`master` образ будет доступен как:
- `ghcr.io/<owner>/<repo>:latest`
- `ghcr.io/<owner>/<repo>:<sha>`

Пример запуска образа из GHCR:

```bash
docker pull ghcr.io/<owner>/<repo>:latest
docker run --rm -p 3000:3000 ghcr.io/<owner>/<repo>:latest
```

## Автозагрузка данных (build-time)

Скрипт `scripts/fetch-artists.mjs` получает работы через Wikidata/Wikimedia API
и обновляет `src/data/artists.ts` перед сборкой.

Команды:

```bash
npm run fetch:data
npm run build
```

Опции:
- `FETCH_ARTISTS_LIMIT=12` — сколько работ на художника сохранять.
- `FETCH_ARTISTS_STRICT=1` — падать с ошибкой при проблемах с сетью.

## Как добавить художника и работу

Откройте файл `src/data/artists.ts`.

1. Добавьте нового художника в массив `artists`.
2. Внутри `works` добавьте его работы.

Формат:

```ts
{
  slug: "new-artist",
  name: "Имя Фамилия",
  bio: "Краткая биография в 2–4 предложениях.",
  years: "1800–1870",
  works: [
    {
      id: "unique-work-id",
      title: "Название",
      year: "1860",
      imageUrl: "https://example.com/image.jpg",
      description: "Полное описание",
      tags: ["тег1", "тег2"]
    }
  ]
}
```

`id` должен быть уникальным. `imageUrl` может быть любым URL; UI корректно обработает битые ссылки.

## Избранное

Избранные работы сохраняются в `localStorage` под ключом `peredvizhniki:favorites`.
Чтобы очистить избранное, удалите ключ в инструментах разработчика браузера.
