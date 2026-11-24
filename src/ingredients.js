import gsap from 'gsap'

const list = document.querySelector('#ingredients-list')
const status = document.querySelector('#ingredients-status')
status.textContent = 'Cargando ingredientes…'

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
            clearProps: 'height'
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

    products.forEach((product, index) => {

      const number = String(index + 1).padStart(2, '0')

      const ingredient = document.createElement('details')
      ingredient.className = 'ingredient'

      const summary = document.createElement('summary')
      summary.className = 'ingredient__summary'

      const label = document.createElement('div')
      const numberLabel = document.createElement('span')
      numberLabel.className = 'ingredient__number'
      numberLabel.textContent = number

      const name = document.createElement('h3')
      name.textContent = product.name

      const brand = document.createElement('p')
      brand.textContent = product.brand

      const plus = document.createElement('span')
      plus.className = 'ingredient__plus'

      label.append(numberLabel, name, brand)
      summary.append(label, plus)

      const content = document.createElement('div')
      content.className = 'ingredient__content'

      product.groups.forEach((group) => {
        const groupElement = document.createElement('div')
        groupElement.className = 'ingredient__group'

        const title = document.createElement('h4')
        title.textContent = group.title

        const items = document.createElement('p')
        items.textContent = `${group.items.join(', ')}.`

        groupElement.append(title, items)
        content.append(groupElement)
      })

      ingredient.append(summary, content)
      list.appendChild(ingredient)
    })


    initIngredientAccordions()
    status.hidden = true

  } catch (error) {
    status.textContent = 'No pudimos cargar los ingredientes. Volvé a intentar recargando la página.'

    console.error(
      'No se pudieron cargar los productos:',
      error
    )

  }

}

loadProducts()
