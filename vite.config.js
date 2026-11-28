import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { localCalendarReviews } from './dev/calendar-reviews.js'

export default defineConfig({
  plugins: [localCalendarReviews()],
  build: {
    rolldownOptions: {
      input: [
        fileURLToPath(new URL('./index.html', import.meta.url)),
        fileURLToPath(new URL('./ingredientes/index.html', import.meta.url)),
      ],
    },
  },
})
