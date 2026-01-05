import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
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
          'rxjs/operators',
          'sqlite3',
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
    plugins: [react({}), tailwindcss()]
  }
})