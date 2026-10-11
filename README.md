# Andinismo de Escritorio — Frontend

Sitio público de [andinismodeescritorio.cl](https://www.andinismodeescritorio.cl): mapa de cerros,
fichas de cerros, rutas, ascensos y andinistas, y el blog de relatos.
Hecho con Nuxt 3 (renderizado en servidor) y Nuxt Content para el blog.
Lee los datos de la API Django de
[andinismodeescritorio-backend](https://github.com/damandak/andinismodeescritorio-backend).

## Requisitos

- Node **22.12 o superior** (`node --version`). Con versiones anteriores `npm ci` se salta
  componentes nativos y la compilación falla con errores como "Cannot find native binding".
  - Mac con instalador oficial (`which node` → `/usr/local/bin/node`): baja el `.pkg` de
    <https://nodejs.org/dist/latest-v22.x/> e instálalo encima.
  - Con nvm: `nvm install 22 && nvm alias default 22`.

## Instalación en tu computador

```bash
git clone https://github.com/damandak/andinismodeescritorio-frontend
cd andinismodeescritorio-frontend
npm ci                 # siempre npm ci, no npm install (no reescribe package-lock.json)
npm run dev            # http://localhost:3000
```

Por defecto el sitio local usa la **API de producción**. Para usar tu backend local, crea un
archivo `.env` en esta carpeta:

```bash
NUXT_PUBLIC_API_BASE=http://127.0.0.1:8000/djangoapi/
GOOGLE_MAPS_API_KEY=<tu clave>
```

y agrega la URL del frontend (`http://localhost:3000`) a `CORS_ALLOWED_ORIGINS` en el `.env`
del backend.

### Variables de entorno

| Variable | Cuándo se lee | Para qué |
| --- | --- | --- |
| `GOOGLE_MAPS_API_KEY` | al compilar (`npm run build`) | Clave de Google Maps para el mapa. |
| `NUXT_PUBLIC_GOOGLE_MAPS_API_KEY` | al arrancar el servidor | Igual que la anterior, pero reemplaza la que quedó al compilar. Útil si el build se hizo en otro lado (GitHub). |
| `GOOGLE_MAPS_MAP_ID` / `NUXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | al compilar / al arrancar | "Map ID" de Google Cloud. Con él, el mapa usa el marcador actual de Google (`AdvancedMarkerElement`); sin él usa el clásico, que Google marcó como obsoleto pero sigue funcionando. Se ven iguales. |
| `NUXT_PUBLIC_API_BASE` | al arrancar el servidor (y en `npm run dev`) | URL de la API. Por defecto `https://andinismodeescritorio.cl/djangoapi/`. |
| `NUXT_PUBLIC_SITE_URL` | al arrancar el servidor | Dirección pública del sitio, usada en URLs canónicas, vistas previas al compartir y `sitemap.xml`. Por defecto `https://www.andinismodeescritorio.cl`. |
| `PORT` | al arrancar el servidor | Puerto del servidor compilado (por defecto 3000). |

### Crear el Map ID de Google (una vez)

1. Entra a <https://console.cloud.google.com/> con la cuenta dueña de la clave de Google Maps
   y elige ese mismo proyecto.
2. Busca **"Map management"** ("Administración de mapas") en Google Maps Platform y crea un
   **Map ID** de tipo **JavaScript**, con mapa **Raster** (admite la vista satelital).
3. Copia el ID y agrégalo en el servidor, en el `env` de `ecosystem.config.js`:
   `NUXT_PUBLIC_GOOGLE_MAPS_MAP_ID: "<el id>"`, y luego `pm2 restart all --update-env`.

Los nombres de los menús de Google cambian a veces; lo que importa es crear un Map ID de
tipo JavaScript en el mismo proyecto de la clave. No cambia lo que Google cobra.

## El mapa

- Los cerros usan los íconos de `public/img/`: `marker3.png` (ascendido),
  `marker-sin-ascenso.png` (sin ascenso registrado) y `marker-alt-3.png` (el cerro de la
  ficha, en el minimapa de "Ubicación").
- Al alejar el zoom, los íconos que se encimarían se agrupan en un círculo con el número de
  cerros (nunca desde el zoom 12 en adelante).
- Los filtros quedan en la URL (`/?pais=Chile&min=5000&ascendido=no`), así que un mapa
  filtrado se puede compartir.
- La lista de cerros del mapa se guarda 10 minutos en el navegador: un cerro recién editado
  puede tardar eso en verse actualizado en el mapa.

## Tablas y fichas

- Las tablas de cerros, rutas, ascensos y andinistas son un solo componente
  (`components/body/DataTable.vue`). Cada página solo define sus columnas.
- La búsqueda, el orden y la página quedan en la URL, así que se pueden compartir y "atrás"
  vuelve al mismo lugar: `/ascensos?buscar=plomo&orden=-fecha&pagina=2&por-pagina=20`.
  El nombre de cada columna en la URL es su `key` (`fecha`, `altura`, `cerro`...).
- La búsqueda espera a que termines de escribir (300 ms) antes de consultar la API.
- La pestaña abierta de una ficha también va en la URL: `/cerros/612?tab=rutas`
  (`ubicacion`, `rutas`, `ascensos`, `referencias`, `otras-rutas`). Sin `tab`, abre "General".
- Todo se puede usar con teclado: Tab recorre los controles, las flechas cambian de pestaña
  y Esc cierra el menú o el buscador.

## Cuentas de usuario

Páginas: `/entrar`, `/crear-cuenta`, `/recuperar-clave`, `/confirmar-email/…`, `/mi-cuenta` y
`/privacidad`. El ícono de persona del menú lleva a "Entrar" o a "Mi cuenta" (con un punto cuando
hay sesión).

- El navegador llama a `/djangoapi/...` en la misma dirección del sitio (en producción nginx lo
  envía a Django), así la sesión funciona sin configuración entre dominios. Toda la lógica está en
  `composables/useAuth.ts`.
- Las páginas de cuenta se arman en el navegador (`ssr: false` en `routeRules`).
- En `npm run dev`, `/djangoapi` se redirige al backend local (`DEV_API_ORIGIN`, por defecto
  `http://127.0.0.1:8000`).
- **Pendiente:** en `pages/privacidad.vue`, reemplazar `[correo de contacto]` por un correo real.

### Propuestas de cambios

- Al pie de cada ficha (`components/record/Contributors.vue`): "Con aportes de: …" (quienes
  tienen propuestas aprobadas) y el enlace "Proponer una corrección".
- `/proponer/<cerro|ruta|ascenso|andinista>/<id>` y `/proponer/cerro/nuevo`: el formulario se
  arma con lo que entrega la API (`/djangoapi/proposals/form/…`: campos, tipo y valor actual) y
  solo envía los datos que cambian, con la fuente obligatoria. Con `?propuesta=<id>` edita una
  propuesta propia que sigue abierta.
- "Mis aportes" en `/mi-cuenta`: estado, mensaje del editor, editar/reenviar y retirar.
- Los editores las revisan en el admin de Django (ver el README del backend).

## Rendimiento

- **Caché de 5 minutos para el blog** (la portada y los relatos): se arman una vez y se
  reutilizan, así que un cambio puede tardar hasta 5 minutos en verse (o `pm2 restart all` para
  verlo al tiro). Las fichas, tablas, mapa y buscador no usan caché: hay miles de fichas con
  pocas visitas cada una, y con caché cada ficha nueva costaría el doble. Está en `routeRules`
  de `nuxt.config.ts`, en memoria con un límite (150 entradas / 10 MB).
- **Fuentes** (Inter y Lora) servidas por el propio sitio desde los paquetes
  `@fontsource-variable/*` (`assets/styles/fonts.css`), no desde Google Fonts.
- **Fotos del blog**: la página pide todas las fotos de un relato en una sola consulta
  (`/djangoapi/images/?ids=…`) y las comparte con `BlogHeader` y `BlogImage`
  (`composables/blogImages.ts`).
- **Compresión**: JS, CSS y fuentes se comprimen al compilar (gzip y brotli). Para que nginx
  comprima también las respuestas de la API, ver "Compresión en nginx" más abajo.

## Compilar y probar como en producción

```bash
GOOGLE_MAPS_API_KEY=<tu clave> npm run build
PORT=3030 node .output/server/index.mjs        # http://localhost:3030
```

Las páginas se arman en el servidor, así que cargan aunque la API no acepte tu puerto. Si en
la consola del navegador aparecen errores de CORS (algunas pestañas o filtros llaman a la API
desde el navegador), usa un backend local con tu URL en `CORS_ALLOWED_ORIGINS`.

## Pruebas automáticas (CI)

En cada `git push`, GitHub instala, compila y verifica que el servidor compilado arranca y
muestra una página (pestaña **Actions**, archivo `.github/workflows/ci.yml`). Una ❌ junto a un
commit significa: no lo despliegues todavía.

En los push a `main` además guarda el build listo (`.output`) como archivo descargable por
14 días (ver "Opción B" abajo).

## Escribir un relato en el blog

Cada relato es un archivo Markdown en `content/blog/`. El nombre del archivo define la URL
(`Cerro-Evelio.md` → `/blog/cerro-evelio`, siempre en minúsculas).

```markdown
---
title: Cerro Evelio y un homenaje entre cumbres olvidadas
author: Agustín Ferrer            # nombre que aparece en el listado
authorid: 1275                    # id del andinista en el admin
description: Resumen corto para el listado y buscadores.
date: 2023-11-24                  # ordena el listado (más nuevo primero)
datespanish: 24 de noviembre del 2023
mainimageid: 80                   # id de la imagen de portada en el admin
draft: false                      # true = no aparece en el listado
---
::blog-header
---
subtitle: Relatos de los Andes Centrales
title: 'Cerro Evelio: un homenaje entre cumbres olvidadas'
authorID: 1275
abstract: Bajada del relato.
datespanish: 24 de noviembre del 2023
image_id: 80
---
::

Texto del relato en Markdown...

::blog-image
---
image_id: 78                      # id de la imagen en el admin
image_detail: Pie de foto
alt: Descripción de la foto para lectores de pantalla
fullwidth: false                  # true = ocupa todo el ancho
---
::
```

Las imágenes se suben primero en el admin del backend (Imágenes) y aquí se usa su id.

## Desplegar en producción

El servidor corre el frontend con **pm2** (configuración en `ecosystem.config.js`, que vive
solo en el servidor). Necesita Node 22 (instalado con nvm).

### Opción A: compilar en el servidor

```bash
cd ~/andinismodeescritorio-frontend
git log --oneline -1          # anota el commit actual por si hay que volver
git pull
rm -rf node_modules .nuxt .output
npm ci
npm run build                 # usa ~1,1 GB de memoria: el servidor necesita swap
pm2 restart all               # o el nombre que muestre `pm2 ls`
```

### Compresión en nginx (una sola vez)

nginx viene comprimiendo solo el HTML. Para que comprima también la API (la lista de cerros
del mapa pesa 5 a 10 veces menos):

```bash
sudo tee /etc/nginx/conf.d/gzip.conf > /dev/null <<'CONF'
gzip_types application/json application/javascript text/css text/javascript text/plain image/svg+xml application/xml;
gzip_vary on;
gzip_proxied any;
gzip_min_length 1024;
gzip_comp_level 5;
CONF
sudo nginx -t && sudo systemctl reload nginx
```

Si `nginx -t` dice `"gzip_types" directive is duplicate`, esas líneas ya estaban activas en
`/etc/nginx/nginx.conf`: borra el archivo nuevo (`sudo rm /etc/nginx/conf.d/gzip.conf`).

### Opción B: usar el build que hizo GitHub

Evita compilar en el servidor (tiene 512 MB de RAM).

1. En GitHub → **Actions** → el último run verde de `main` → descarga el artefacto
   `output-<commit>` (un `.zip`).
2. Súbelo al servidor: `scp output-*.zip adeadmin@<servidor>:~/`
3. En el servidor:
   ```bash
   cd ~/andinismodeescritorio-frontend
   git pull                                   # para que el código coincida con el build
   rm -rf .output.old && mv .output .output.old
   mkdir .output && unzip -q ~/output-*.zip -d .output && rm ~/output-*.zip
   pm2 restart all
   ```
4. Como ese build se compiló sin la clave real de Google Maps, define
   `NUXT_PUBLIC_GOOGLE_MAPS_API_KEY` en el `env` de `ecosystem.config.js` (una sola vez) y
   corre `pm2 restart all --update-env`.

Para volver atrás con la opción B: `rm -rf .output && mv .output.old .output && pm2 restart all`.

## Estructura

```
pages/          rutas del sitio (/cerros, /rutas, /ascensos, /andinistas, /blog, ...)
components/     componentes por sección (mountain/, routes/, ascent/, andinist/, map/, ...);
                body/ tiene lo común: tabla (DataTable), pestañas (TabWrapper)
composables/    useApiDetail (carga de fichas con 404 real), usePageTabs (pestaña en la URL),
                usePageSeo (título, descripción, vista previa al compartir),
                mountainMap (mapa, íconos, grupos, pop-ups)
utils/          formato de fechas parciales y altitudes, filtros del mapa, tamaños de imagen,
                estado de las tablas en la URL (tableQuery)
server/routes/  sitemap.xml y robots.txt (generados con los datos de la API)
content/blog/   relatos del blog en Markdown
public/img/     íconos y marcadores del mapa
error.vue       página de error / 404
```
