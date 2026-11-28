import './css/product-reviews.css'

const minimumRatings = 5
const ratingFormat = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 })
const countFormat = new Intl.NumberFormat('es-AR')

function createReviewPanel({ average, count, comments }, href) {
  const panel = document.createElement('section')
  panel.className = 'product-reviews'
  panel.setAttribute('aria-label', 'Opiniones en Mercado Libre')

  const rating = document.createElement('div')
  rating.className = 'product-reviews__rating'

  const stars = document.createElement('span')
  stars.className = 'product-reviews__stars'
  stars.setAttribute('aria-hidden', 'true')
  stars.style.setProperty('--rating-fill', `${average / 5 * 100}%`)
  stars.textContent = '★★★★★'

  const score = document.createElement('strong')
  score.textContent = `${ratingFormat.format(average)} / 5`

  const countLabel = document.createElement('span')
  countLabel.className = 'product-reviews__count'
  countLabel.textContent = `${countFormat.format(count)} valoraciones`
  rating.append(stars, score, countLabel)
  panel.append(rating)

  if (comments.length) {
    const details = document.createElement('details')
    const title = document.createElement('summary')
    title.textContent = 'Leer opiniones'
    details.append(title)

    for (const { content, rate } of comments) {
      const comment = document.createElement('blockquote')
      const reviewScore = document.createElement('strong')
      const text = document.createElement('p')
      reviewScore.textContent = `★ ${ratingFormat.format(rate)} / 5`
      text.textContent = content
      comment.append(reviewScore, text)
      details.append(comment)
    }
    panel.append(details)
  }

  const link = document.createElement('a')
  link.href = href
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.textContent = 'Ver en Mercado Libre'
  panel.append(link)
  return panel
}

export async function loadProductReviews() {
  try {
    const response = await fetch('/api/local/product-reviews')
    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error('Reiniciá Vite para cargar la ruta local de opiniones.')
    }

    const reviews = await response.json()
    if (!response.ok) throw new Error(reviews.error)

    for (const product of document.querySelectorAll('[data-reviews]')) {
      const review = reviews[product.dataset.reviews]
      const link = product.querySelector('.product__link')
      if (link && review?.count >= minimumRatings && review.average > 0 && review.average <= 5) {
        link.before(createReviewPanel(review, link.href))
      }
    }
  } catch (error) {
    console.warn('No se pudieron cargar las opiniones de Mercado Libre:', error.message)
  }
}
