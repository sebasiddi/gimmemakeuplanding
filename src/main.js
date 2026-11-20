import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const mm = gsap.matchMedia()


// ======================================
// HERO - DESKTOP
// ======================================


/* ======================================
   HERO - PARALLAX POR SCROLL
====================================== */

const heroMM = gsap.matchMedia()


// ======================================
// DESKTOP
// ======================================

heroMM.add('(min-width: 769px)', () => {

  initHeroParallax({
    logoY: -900,
    girlY: -180,
    starWhiteY: -120,
    starPinkY: -240,
    starBlueY: -65,
    sloganY: -160
  })

})


// ======================================
// MOBILE
// ======================================
heroMM.add('(max-width: 768px)', () => {

  initHeroParallax({
    logoY: -650,
    girlY: -100,
    starWhiteY: -75,
    starPinkY: -150,
    starBlueY: -40,
    sloganY: -110
  })

})

// ======================================
// FUNCIÓN DE ANIMACIÓN
// ======================================
function initHeroParallax(config) {

  const hero = document.querySelector('.hero')

  if (!hero) return

  const logo = hero.querySelector('.hero__logo')
  const girl = hero.querySelector('.hero__girl')

  const starWhite = hero.querySelector('.hero__star--white')
  const starPink = hero.querySelector('.hero__star--pink')
  const starBlue = hero.querySelector('.hero__star--blue')

  const slogan = hero.querySelector('.hero__slogan')

  if (!logo || !girl || !starWhite || !starPink || !starBlue || !slogan) {
    console.warn('Faltan elementos del nuevo hero')
    return
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=150%',
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
      markers: false
    }
  })

  // LOGO: sube rápido
  tl.to(logo, {
    y: config.logoY,
    ease: 'none'
  }, 0)

  // CHICA: sube lentamente
  tl.to(girl, {
    y: config.girlY,
    ease: 'none'
  }, 0)

  // ESTRELLA BLANCA
  tl.to(starWhite, {
    y: config.starWhiteY,
    ease: 'none'
  }, 0)

  // ESTRELLA ROSA
  tl.to(starPink, {
    y: config.starPinkY,
    ease: 'none'
  }, 0)

  // ESTRELLA AZUL
  tl.to(starBlue, {
    y: config.starBlueY,
    ease: 'none'
  }, 0)

  // SLOGAN: desaparece al principio
  tl.to(slogan, {
    y: config.sloganY,
    opacity: 0,
    duration: 0.2,
    ease: 'none'
  }, 0)
  // ======================================
  // CURVAS - MOVIMIENTOS INDEPENDIENTES
  // ======================================

  tl.to('.hero__curve--dots-right', {
    y: -100,
    ease: 'none'
  }, 0)

  tl.to('.hero__curve--dots-left', {
    y: -220,
    ease: 'none'
  }, 0)

  tl.to('.hero__curve--right', {
    y: -350,
    ease: 'none'
  }, 0)

  tl.to('.hero__curve--left-one', {
    y: -180,
      ease: 'none'
  }, 0)

  tl.to('.hero__curve--left-two', {
    y: -90,
    ease: 'none'
  }, 0)

  tl.to('.hero__curve--extra', {
    y: -280,
    x: -50,
    ease: 'none'
  }, 0)

}


/* ======================================
   TREAT YOURSELF - ANIMACIÓN DE ENTRADA
====================================== */

const adventLaunch = document.querySelector('.advent-launch')

if (adventLaunch) {

  const adventGirl = adventLaunch.querySelector('.advent-launch__girl')

  const calendar12 = adventLaunch.querySelector(
    '.advent-launch__calendar--12'
  )

  const calendar24 = adventLaunch.querySelector(
    '.advent-launch__calendar--24'
  )

  if (adventGirl && calendar12 && calendar24) {

    const adventTL = gsap.timeline({
      scrollTrigger: {
        trigger: adventLaunch,
        start: 'top 75%',
        once: true,
        markers: false
      }
    })

    // MODELO: entra desde abajo

    adventTL.from(adventGirl, {
      y: 180,
      autoAlpha: 0,
      duration: 1.3,
      ease: 'power3.out'
    })

    // CALENDARIO 12: aparece desde la izquierda

    adventTL.from(calendar12, {
      x: -120,
      y: 70,
      scale: 0.75,
      autoAlpha: 0,
      duration: 1,
      ease: 'back.out(1.4)'
    }, '-=0.5')

    // CALENDARIO 24: aparece desde la derecha

    adventTL.from(calendar24, {
      x: 120,
      y: 70,
      scale: 0.75,
      autoAlpha: 0,
      duration: 1,
      ease: 'back.out(1.4)'
    }, '<')

  }
}




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