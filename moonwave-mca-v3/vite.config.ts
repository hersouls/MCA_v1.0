import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// Dev-only plugin: serve Vercel API routes locally via dynamic import
function vercelApiDev(): Plugin {
  return {
    name: 'vercel-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()

        try {
          // Map URL to file: /api/stock/search → ./api/stock/search.ts
          // /api/stock/AAPL → ./api/stock/[ticker].ts with params
          const url = new URL(req.url, 'http://localhost')
          const pathname = url.pathname

          let handlerPath: string
          const query: Record<string, string> = {}

          // Parse query string
          url.searchParams.forEach((v, k) => { query[k] = v })

          if (pathname === '/api/exchange-rate') {
            handlerPath = resolve(__dirname, 'api/exchange-rate.ts')
          } else if (pathname === '/api/stock/search') {
            handlerPath = resolve(__dirname, 'api/stock/search.ts')
            query.q = query.q || ''
          } else if (pathname.startsWith('/api/stock/')) {
            handlerPath = resolve(__dirname, 'api/stock/[ticker].ts')
            query.ticker = pathname.split('/api/stock/')[1]
          } else {
            return next()
          }

          // Dynamic import the handler (tsx/ts supported by Vite's ssrLoadModule)
          const mod = await server.ssrLoadModule(handlerPath)
          const handler = mod.default

          if (typeof handler !== 'function') {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Handler not found' }))
            return
          }

          // Create mock Vercel req/res
          const mockReq = {
            method: req.method,
            url: req.url,
            query,
            headers: req.headers,
            body: null,
          }

          const mockRes = {
            statusCode: 200,
            _headers: {} as Record<string, string>,
            _body: null as unknown,
            _ended: false,
            setHeader(key: string, value: string) {
              this._headers[key.toLowerCase()] = value
              return this
            },
            status(code: number) {
              this.statusCode = code
              return this
            },
            json(data: unknown) {
              this._body = JSON.stringify(data)
              this._ended = true
              return this
            },
            end(data?: string) {
              if (data) this._body = data
              this._ended = true
              return this
            },
          }

          await handler(mockReq, mockRes)

          res.statusCode = mockRes.statusCode
          for (const [k, v] of Object.entries(mockRes._headers)) {
            res.setHeader(k, v)
          }
          if (!res.getHeader('content-type') && mockRes._body) {
            res.setHeader('content-type', 'application/json')
          }
          res.end(mockRes._body as string)
        } catch (e) {
          console.error('[vercel-api-dev]', e)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Internal Server Error', message: String(e) }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // 커스텀 도메인(mca.moonwave.kr) 사용 시 base는 '/'
  base: '/',
  plugins: [react(), tailwindcss(), vercelApiDev()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],
          // Router
          'router': ['react-router-dom'],
          // Chart (lazy loaded when needed)
          'chart': ['chart.js', 'react-chartjs-2', 'chartjs-plugin-datalabels'],
          // Animation
          'motion': ['framer-motion'],
          // UI libraries (separated)
          'headless': ['@headlessui/react'],
          'icons': ['lucide-react'],
          'aria': ['react-aria-components'],
          // Database
          'db': ['dexie'],
          // State management
          'state': ['zustand'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
