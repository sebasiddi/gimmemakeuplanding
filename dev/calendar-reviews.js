import { loadEnv } from 'vite'

const products = {
  'treat-12': { itemId: 'MLA4209317044', catalogId: 'MLA2133324404' },
  'treat-24': { itemId: 'MLA4209345072' },
  'christmas-12': { itemId: 'MLA1632532439', catalogId: 'MLA2117722777' },
  'mini-glam': { itemId: 'MLA1513483543' },
}
const apiOrigin = 'https://api.mercadolibre.com'

async function getMercadoLibre(path, token) {
  const response = await fetch(new URL(path, apiOrigin), {
    headers: { Authorization: `Bearer ${token}` },
    redirect: 'error',
    signal: AbortSignal.timeout(6000),
  })
  if (!response.ok) {
    throw new Error(`Mercado Libre respondió con HTTP ${response.status}`)
  }
  return response.json()
}

async function getProductReviews({ itemId, catalogId }, token) {
  const query = new URLSearchParams({ limit: '5' })
  if (catalogId) query.set('catalog_product_id', catalogId)
  const data = await getMercadoLibre(
    `/reviews/item/${itemId}?${query}`,
    token,
  )
  return {
    average: data.rating_average,
    count: data.paging?.total,
    comments: (data.reviews ?? [])
      .filter(({ status, content }) => status === 'published' && typeof content === 'string' && content.trim())
      .slice(0, 3)
      .map(({ content, rate }) => ({ content, rate })),
  }
}

async function getReviewsByProduct(token) {
  const entries = await Promise.all(Object.entries(products).map(async ([key, product]) => {
    try {
      return [key, await getProductReviews(product, token)]
    } catch (error) {
      console.warn(`Opiniones de Mercado Libre (${key}): ${error.message}`)
      return [key, null]
    }
  }))
  return Object.fromEntries(entries)
}

async function getLocalToken(env) {
  const token = env.MELI_ACCESS_TOKEN?.trim()
  if (token || !env.MELI_SELLERRADAR_DB) return token

  const { DatabaseSync } = await import('node:sqlite')
  const db = new DatabaseSync(env.MELI_SELLERRADAR_DB, { readOnly: true })
  try {
    return db.prepare(`
      SELECT access_token
      FROM mercadolibre_mercadolibreaccount
      WHERE length(trim(access_token)) > 0
        AND datetime(token_expires_at) > datetime('now')
      ORDER BY token_expires_at DESC
      LIMIT 1
    `).get()?.access_token.trim()
  } finally {
    db.close()
  }
}

export function localCalendarReviews() {
  return {
    name: 'local-calendar-reviews',
    apply: 'serve',
    configureServer(server) {
      const { mode, envDir } = server.config
      const env = loadEnv(mode, envDir, 'MELI_')
      let pending
      let expiresAt = 0

      server.middlewares.use('/api/local/product-reviews', async (request, response) => {
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        if (request.method !== 'GET') {
          response.statusCode = 405
          response.setHeader('Allow', 'GET')
          return response.end('{}')
        }
        try {
          if (!pending || Date.now() >= expiresAt) {
            const token = await getLocalToken(env)
            if (!token) {
              response.statusCode = 503
              return response.end(JSON.stringify({
                error: 'No hay un token vigente. Abrí Mis publicaciones en SellerRadar y recargá la landing.',
              }))
            }
            expiresAt = Date.now() + 5 * 60 * 1000
            pending = getReviewsByProduct(token)
          }
          response.end(JSON.stringify(await pending))
        } catch (error) {
          pending = undefined
          response.statusCode = 502
          response.end(JSON.stringify({ error: error.message }))
        }
      })
    },
  }
}
