import solid from 'vite-plugin-solid'
import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@main": resolve('src/main'),
        "@shared": resolve('src/shared'),
      }
    },
    plugins: [],
    build: {
      rollupOptions: {
        external: [
          // deixa o Nest fora do bundle
          '@nestjs/common',
          '@nestjs/core',
          '@nestjs/platform-express',
          '@nestjs/typeorm',
          'typeorm',
          'reflect-metadata',
          'rxjs',
          'pg',
        ],
      },
    },
  },
  preload: {
    plugins: []
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared')
      }
    },
    plugins: [solid(), tailwindcss()]
  }
})