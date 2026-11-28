import { writeFile } from 'node:fs/promises'

const response = await fetch('http://localhost:5173/api/local/product-reviews', {
  signal: AbortSignal.timeout(10000),
})
if (!response.ok) {
  throw new Error(`El servidor local de opiniones respondió con HTTP ${response.status}`)
}

const reviews = await response.json()
const expectedProducts = ['treat-12', 'treat-24', 'christmas-12', 'mini-glam']
const snapshot = {}

for (const key of expectedProducts) {
  const review = reviews[key]
  if (!Number.isInteger(review?.count) || review.count < 0) {
    throw new Error(`No se pudo verificar el total de valoraciones de ${key}`)
  }
  if (review.count >= 5) {
    if (!Number.isFinite(review.average) || review.average <= 0 || review.average > 5) {
      throw new Error(`El promedio de ${key} es inválido`)
    }
    snapshot[key] = {
      average: review.average,
      count: review.count,
      comments: review.comments.map(({ content, rate }) => ({ content, rate })),
    }
  }
}

await writeFile(
  new URL('../public/data/product-reviews.json', import.meta.url),
  JSON.stringify(snapshot, null, 2) + '\n',
)
console.log(`Opiniones exportadas para ${Object.keys(snapshot).length} productos`)
