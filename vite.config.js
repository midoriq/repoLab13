import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { glob } from 'glob'

const __dirname = dirname(fileURLToPath(import.meta.url))

const inputs = [];

for await (const entry of await glob('src/**/*.html')) {
  console.log(resolve(__dirname, entry));
  inputs.push(resolve(__dirname, entry));
}

export default defineConfig({
  plugins: [],

  root: resolve(__dirname, 'src'),
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: inputs,
    },
    outDir: resolve(__dirname, 'dist'),
  },
})
