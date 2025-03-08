// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Enable CORS for development
    cors: true,
    // Set up a proxy for the ESP8266 device
    proxy: {
      '/esp8266': {
        target: 'http://192.168.4.1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/esp8266/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from:', req.url, proxyRes.statusCode);
          });
        },
      }
    }
  }
})