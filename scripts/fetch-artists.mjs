import fs from "node:fs/promises";
import path from "node:path";

const OUTPUT_PATH = path.resolve("src/data/artists.ts");
const STRICT = process.env.FETCH_ARTISTS_STRICT === "1";
const LIMIT = Number(process.env.FETCH_ARTISTS_LIMIT ?? "24");

const ARTISTS = [
  {
    slug: "pukirev",
    name: "Василий Пукирёв",
    bio:
      "Русский живописец и педагог, один из ярких мастеров жанровой живописи. " +
      "Его работы поднимают социальные темы и драматургию человеческих отношений. " +
      "Пукирёв был связан с московской художественной средой и преподавал в училищах.",
    years: "1832–1890",
    search: "Василий Пукирёв"
  },
  {
    slug: "perov",
    name: "Василий Перов",
    bio:
      "Один из основателей Товарищества передвижных выставок. " +
      "Его живопись сочетает внимательное наблюдение за бытом и глубокий психологизм. " +
      "Перов поднимал темы морали и социальной несправедливости.",
    years: "1834–1882",
    search: "Василий Перов"
  },
  {
    slug: "repin",
    name: "Илья Репин",
    bio:
      "Крупнейший реалист, мастер исторической и жанровой живописи. " +
      "Его картины раскрывают драму эпохи и внутренний мир героев. " +
      "Репин активно участвовал в выставках передвижников.",
    years: "1844–1930",
    search: "Илья Репин"
  },
  {
    slug: "ge",
    name: "Николай Ге",
    bio:
      "Художник-реалист с ярко выраженным интересом к историческим и религиозным сюжетам. " +
      "Его работы отличаются драматической композицией и философским подтекстом. " +
      "Ге был важной фигурой в среде передвижников.",
    years: "1831–1894",
    search: "Николай Ге"
  },
  {
    slug: "yaroshenko",
    name: "Николай Ярошенко",
    bio:
      "Художник, общественный деятель и один из ведущих передвижников. " +
      "Его картины часто посвящены теме человеческого достоинства и социальной справедливости. " +
      "Ярошенко получил прозвище «совесть передвижников».",
    years: "1846–1898",
    search: "Николай Ярошенко"
  },
  {
    slug: "surikov",
    name: "Василий Суриков",
    bio:
      "Выдающийся русский исторический живописец, мастер масштабных композиций. " +
      "Его картины наполнены драмой и вниманием к характеру людей и эпохи. " +
      "Суриков оказал большое влияние на развитие национальной школы живописи.",
    years: "1848–1916",
    search: "Василий Суриков"
  },
  {
    slug: "kramskoy",
    name: "Иван Крамской",
    bio:
      "Художник, критик и один из идеологов передвижников. " +
      "Особенно известен как тонкий портретист и мастер психологической выразительности. " +
      "Крамской активно формировал художественную повестку своего времени.",
    years: "1837–1887",
    search: "Иван Крамской"
  },
  {
    slug: "kuindzhi",
    name: "Архип Куинджи",
    bio:
      "Русский живописец-пейзажист, прославившийся работой со светом и цветом. " +
      "Его полотна часто строятся на эффекте свечения и почти театральной атмосфере. " +
      "Куинджи объединял реализм и выразительную декоративность.",
    years: "1842–1910",
    search: "Архип Куинджи"
  },
  {
    slug: "levitan",
    name: "Исаак Левитан",
    bio:
      "Классик русского лирического пейзажа, мастер настроения и тонких состояний природы. " +
      "Его работы передают ощущение тишины, времени года и внутреннего переживания. " +
      "Левитан считается одним из самых поэтичных художников своей эпохи.",
    years: "1860–1900",
    search: "Исаак Левитан"
  },
  {
    slug: "serov",
    name: "Валентин Серов",
    bio:
      "Русский живописец, выдающийся портретист рубежа XIX–XX веков. " +
      "Его стиль сочетает точность наблюдения и свободную живописную манеру. " +
      "Серов писал как парадные, так и камерные психологические портреты.",
    years: "1865–1911",
    search: "Валентин Серов"
  }
];

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const THUMB_WIDTH = Number(process.env.FETCH_ARTISTS_THUMB_WIDTH ?? "1400");
const thumbCache = new Map();
const extractCache = new Map();
const ENTITY_CHUNK_SIZE = 40;

function normalizeTitle(value) {
  return value.trim().toLowerCase();
}

function getFileNameFromUrl(url) {
  try {
    const parsed = new URL(url);
    const name = decodeURIComponent(parsed.pathname.split("/").pop() ?? "");
    return name.replace(/^File:/i, "");
  } catch {
    const parts = url.split("/");
    return decodeURIComponent(parts[parts.length - 1] ?? "").replace(/^File:/i, "");
  }
}

function getFileExtension(name) {
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

function toFilePathUrl(url) {
  const name = getFileNameFromUrl(url);
  if (!name) return null;
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}`;
}

async function fetchThumbnailUrl(fileName) {
  if (!fileName) return null;
  if (thumbCache.has(fileName)) return thumbCache.get(fileName);
  const title = encodeURIComponent(`File:${fileName}`);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${title}&prop=imageinfo&iiprop=url&iiurlwidth=${THUMB_WIDTH}&format=json&origin=*`;
  const data = await fetchJson(url);
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  const thumb = page?.imageinfo?.[0]?.thumburl ?? page?.imageinfo?.[0]?.url ?? null;
  thumbCache.set(fileName, thumb);
  return thumb;
}

async function resolveImageUrl(rawUrl) {
  const filePathUrl = toFilePathUrl(rawUrl);
  if (!filePathUrl) return null;
  const fileName = getFileNameFromUrl(rawUrl);
  const ext = getFileExtension(fileName);
  if (ALLOWED_EXTENSIONS.has(ext)) {
    return filePathUrl;
  }
  const thumbUrl = await fetchThumbnailUrl(fileName);
  return thumbUrl;
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "peredvizhniki-gallery/1.0 (build-time fetch)"
    },
    ...options
  });
  if (!res.ok) {
    throw new Error(`Request failed ${res.status}: ${url}`);
  }
  const data = await res.json();
  if (data?.error) {
    throw new Error(`API error: ${data.error.code ?? "unknown"}`);
  }
  return data;
}

async function resolveArtistQid(artist) {
  if (artist.wikidataId) return artist.wikidataId;
  const search = encodeURIComponent(artist.search ?? artist.name);
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${search}&language=ru&format=json&limit=1`;
  const data = await fetchJson(url);
  const item = data?.search?.[0];
  if (!item?.id) {
    throw new Error(`Wikidata id not found for ${artist.name}`);
  }
  return item.id;
}

async function fetchWikidataEntities(ids) {
  if (!ids.length) return {};
  const entities = {};
  for (let i = 0; i < ids.length; i += ENTITY_CHUNK_SIZE) {
    const chunk = ids.slice(i, i + ENTITY_CHUNK_SIZE);
    const url =
      "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=descriptions|sitelinks&languages=ru|en&sitefilter=ruwiki&ids=" +
      chunk.join("|");
    const data = await fetchJson(url);
    Object.assign(entities, data?.entities ?? {});
  }
  return entities;
}

async function fetchWikipediaExtract(title) {
  if (!title) return null;
  if (extractCache.has(title)) return extractCache.get(title);
  const url =
    "https://ru.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&explaintext=1&exsectionformat=plain&exintro=1&exchars=800&titles=" +
    encodeURIComponent(title);
  const data = await fetchJson(url);
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  const extract = page?.extract?.trim() || null;
  extractCache.set(title, extract);
  return extract;
}

async function enrichWithDescriptions(works) {
  const ids = works.map((work) => work.id).filter(Boolean);
  const entities = await fetchWikidataEntities(ids);
  for (const work of works) {
    const entity = entities?.[work.id];
    const wikiTitle = entity?.sitelinks?.ruwiki?.title ?? null;
    const extract = wikiTitle ? await fetchWikipediaExtract(wikiTitle) : null;
    const fallback = entity?.descriptions?.ru?.value ?? entity?.descriptions?.en?.value ?? null;
    work.description = extract ?? fallback ?? null;
  }
  return works;
}

async function fetchWorksByArtist(qid) {
  const query = `SELECT ?item ?itemLabel ?image ?inception WHERE {
    ?item wdt:P31/wdt:P279* wd:Q3305213 .
    ?item wdt:P170 wd:${qid} .
    ?item wdt:P18 ?image .
    OPTIONAL { ?item wdt:P571 ?inception . }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "ru,en". }
  }`;
  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
  const data = await fetchJson(url);
  const results = [];
  for (const row of data.results.bindings) {
    const itemUrl = row.item.value;
    const id = itemUrl.split("/").pop();
    const title = row.itemLabel.value;
    const imageUrl = await resolveImageUrl(row.image.value);
    if (!imageUrl) {
      continue;
    }
    const year = row.inception?.value ? row.inception.value.slice(0, 4) : undefined;
    results.push({ id, title, imageUrl, year, description: null, tags: undefined });
  }
  return enrichWithDescriptions(results);
}

function finalizeWorks(slug, works) {
  const withDescriptions = works.map((work) => ({
    id: work.id,
    title: work.title,
    year: work.year,
    imageUrl: work.imageUrl,
    description:
      work.description ??
      "Описание будет добавлено позже. Используйте это поле, чтобы дать исторический контекст и детали композиции.",
    tags: work.tags
  }));

  withDescriptions.sort((a, b) => a.title.localeCompare(b.title, "ru"));
  return withDescriptions.slice(0, LIMIT);
}

function escapeString(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, " ")
    .trim();
}

function formatArtistsFile(artists) {
  const lines = [];
  lines.push("import type { Artist } from \"@/types\";\n");
  lines.push("// AUTO-GENERATED by scripts/fetch-artists.mjs\n");
  lines.push("// Do not edit manually unless you disable build-time fetch.\n\n");
  lines.push("export const artists: Artist[] = [\n");

  for (const artist of artists) {
    lines.push("  {\n");
    lines.push(`    slug: \"${escapeString(artist.slug)}\",\n`);
    lines.push(`    name: \"${escapeString(artist.name)}\",\n`);
    lines.push(`    bio: \"${escapeString(artist.bio)}\",\n`);
    if (artist.years) {
      lines.push(`    years: \"${escapeString(artist.years)}\",\n`);
    }
    lines.push("    works: [\n");
    for (const work of artist.works) {
      lines.push("      {\n");
      lines.push(`        id: \"${escapeString(work.id)}\",\n`);
      lines.push(`        title: \"${escapeString(work.title)}\",\n`);
      if (work.year) {
        lines.push(`        year: \"${escapeString(work.year)}\",\n`);
      }
      lines.push(`        imageUrl: \"${escapeString(work.imageUrl)}\",\n`);
      lines.push(`        description: \"${escapeString(work.description)}\",\n`);
      if (work.tags?.length) {
        lines.push(
          `        tags: [${work.tags.map((tag) => `\"${escapeString(tag)}\"`).join(", ")}]\n`
        );
      }
      lines.push("      },\n");
    }
    lines.push("    ]\n");
    lines.push("  },\n");
  }

  lines.push("];\n");
  return lines.join("");
}

async function run() {
  let existing = null;
  try {
    existing = await fs.readFile(OUTPUT_PATH, "utf8");
  } catch {
    existing = null;
  }

  try {
    const result = [];
    for (const artist of ARTISTS) {
      const qid = await resolveArtistQid(artist);
      const worksFromApi = await fetchWorksByArtist(qid);
      const works = finalizeWorks(artist.slug, worksFromApi);

      result.push({
        slug: artist.slug,
        name: artist.name,
        bio: artist.bio,
        years: artist.years,
        works
      });
    }

    const fileContent = formatArtistsFile(result);
    await fs.writeFile(OUTPUT_PATH, fileContent, "utf8");
    console.log(`Updated ${OUTPUT_PATH}`);
  } catch (error) {
    console.error("Failed to fetch artists:", error);
    if (existing) {
      await fs.writeFile(OUTPUT_PATH, existing, "utf8");
      console.warn("Restored previous artists.ts content.");
    }
    if (STRICT) {
      process.exit(1);
    }
  }
}

run();
