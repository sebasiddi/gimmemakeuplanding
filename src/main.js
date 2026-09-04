import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const mm = gsap.matchMedia()


// ======================================
// HERO - DESKTOP
// ======================================

mm.add('(min-width: 769px)', () => {

  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '+=150%',
      scrub: 1,
      pin: true,
      markers: false,
      invalidateOnRefresh: true
    }
  })

  heroTl
    .to('.hero__shape--pink', {
      x: -220,
      y: -120,
      rotation: -25
    }, 0)

    .to('.hero__shape--white', {
      x: 120,
      y: -180,
      scale: 1.4
    }, 0)

    .to('.hero__shape--orange-ball', {
      x: 180,
      y: 80,
      scale: 1.3
    }, 0)

    .to('.hero__shape--yellow', {
      x: -250,
      y: 180,
      rotation: -20
    }, 0)

    .to('.hero__shape--orange-line', {
      x: 250,
      y: 160,
      rotation: 20
    }, 0)

    .to('.hero__shape--orange', {
      x: 300,
      y: -100,
      rotation: 15
    }, 0)

    .to('.hero h1', {
      scale: 1.15
    }, 0)

})


// ======================================
// HERO - MOBILE
// ======================================

mm.add('(max-width: 768px)', () => {

  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '+=100%',
      scrub: 1,
      pin: true,
      markers: false,
      invalidateOnRefresh: true
    }
  })

  heroTl
    .to('.hero__shape--pink', {
      x: -50,
      y: -70,
      rotation: -15
    }, 0)

    .to('.hero__shape--white', {
      x: 30,
      y: -60,
      scale: 1.2
    }, 0)

    .to('.hero__shape--orange-ball', {
      x: 50,
      y: 30,
      scale: 1.15
    }, 0)

    .to('.hero__shape--yellow', {
      x: -60,
      y: 80,
      rotation: -12
    }, 0)

    .to('.hero__shape--orange-line', {
      x: 60,
      y: 70,
      rotation: 12
    }, 0)

    .to('.hero__shape--orange', {
      x: 70,
      y: -50,
      rotation: 8
    }, 0)

    .to('.hero h1', {
      scale: 1.06
    }, 0)

})


// ======================================
// PRODUCTOS - ENTRADA SUAVE
// ======================================

gsap.utils.toArray('.product').forEach((product) => {

  const image = product.querySelector('.product__image')
  const content = product.querySelector('.product__content')

  if (image) {
    gsap.fromTo(
      image,
      {
        y: 80,
        opacity: 0,
        scale: 0.96
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',

        scrollTrigger: {
          trigger: product,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true
        }
      }
    )
  }

  if (content) {
    gsap.fromTo(
      content,
      {
        y: 60,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 2,
        delay: 0.25,
        ease: 'power3.out',

        scrollTrigger: {
          trigger: product,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true
        }
      }
    )
  }

})


// ======================================
// INGREDIENTES - ACORDEONES
// ======================================

function initIngredientAccordions() {

  const ingredients = document.querySelectorAll('.ingredient')

  ingredients.forEach((item) => {

    const summary = item.querySelector('.ingredient__summary')
    const content = item.querySelector('.ingredient__content')

    if (!summary || !content) {
      return
    }

    summary.addEventListener('click', (event) => {

      event.preventDefault()

      if (item.open) {

        // ------------------------------
        // CERRAR
        // ------------------------------

        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',

          onComplete: () => {

            item.open = false

            gsap.set(content, {
              clearProps: 'height,opacity'
            })

            ScrollTrigger.refresh()
          }
        })

      } else {

        // ------------------------------
        // ABRIR
        // ------------------------------

        item.open = true

        gsap.fromTo(
          content,
          {
            height: 0,
            opacity: 0
          },
          {
            height: 'auto',
            opacity: 1,
            duration: 0.45,
            ease: 'power2.out',
            clearProps: 'height',

            onComplete: () => {
              ScrollTrigger.refresh()
            }
          }
        )
      }

    })

  })

}


// ======================================
// CARGA DE INGREDIENTES
// ======================================

async function loadProducts() {

  try {

    const response = await fetch('/data/products.json')

    if (!response.ok) {
      throw new Error(
        `Error al cargar products.json: ${response.status}`
      )
    }

    const products = await response.json()

    const list = document.querySelector('#ingredients-list')

    if (!list) {
      console.error('No se encontró #ingredients-list')
      return
    }

    products.forEach((product, index) => {

      const number = String(index + 1).padStart(2, '0')

      const groupsHTML = product.groups
        .map(
          (group) => `
            <div class="ingredient__group">
              <h4>${group.title}</h4>
              <p>${group.items.join(', ')}.</p>
            </div>
          `
        )
        .join('')

      const ingredient = document.createElement('details')

      ingredient.className = 'ingredient'

      ingredient.innerHTML = `
        <summary class="ingredient__summary">
          <div>
            <span class="ingredient__number">
              ${number}
            </span>

            <h3>
              ${product.name}
            </h3>

            <p>
              ${product.brand}
            </p>
          </div>

          <span class="ingredient__plus"></span>
        </summary>

        <div class="ingredient__content">
          ${groupsHTML}
        </div>
      `

      list.appendChild(ingredient)
    })


    // Activamos acordeones
    initIngredientAccordions()


    // El contenido cambió de altura.
    // Recalculamos todos los ScrollTrigger.
    ScrollTrigger.refresh()

  } catch (error) {

    console.error(
      'No se pudieron cargar los productos:',
      error
    )

  }

}


// ======================================
// HIDDEN GEMS - APERTURA POR SCROLL
// ======================================

function initHiddenGemsSequence() {

  const hiddenGemsProduct =
    document.querySelector('.hidden-gems-product')

  const hiddenGemsImage =
    document.querySelector('.hidden-gems-sequence__image')


  // Si el HTML todavía no tiene alguno
  // de estos elementos, simplemente no
  // ejecutamos esta animación.

  if (!hiddenGemsProduct || !hiddenGemsImage) {

    console.warn(
      'No se encontraron los elementos de la secuencia Hidden Gems'
    )

    return
  }


  // ------------------------------
  // FRAMES
  // ------------------------------

  const hiddenGemsFrames = []

  for (let i = 1; i <= 7; i++) {

    hiddenGemsFrames.push(
      `/images/products/calendario-15-${i}.png`
    )

  }


  // ------------------------------
  // PRECARGA DE IMÁGENES
  // ------------------------------

  hiddenGemsFrames.forEach((src) => {

    const img = new Image()

    img.src = src

  })


  // ------------------------------
  // CONTROL DE FRAME
  // ------------------------------

  const hiddenGemsSequence = {
    frame: 0
  }


  // ------------------------------
  // ANIMACIÓN
  // ------------------------------

  gsap.to(hiddenGemsSequence, {

    frame: hiddenGemsFrames.length - 1,

    ease: 'none',

    scrollTrigger: {

      trigger: hiddenGemsProduct,

      start: 'top top',

      end: '+=250%',

      scrub: 0.5,

      pin: true,

      markers: false,

      invalidateOnRefresh: true
    },

    onUpdate: () => {

      const frame = Math.round(
        hiddenGemsSequence.frame
      )

      hiddenGemsImage.src =
        hiddenGemsFrames[frame]

    }

  })

}


// ======================================
// INICIALIZACIÓN
// ======================================

loadProducts()

initHiddenGemsSequence()


// ======================================
// REFRESH FINAL
// ======================================

window.addEventListener('load', () => {

  ScrollTrigger.refresh()

})