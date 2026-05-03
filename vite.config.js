import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      imports: [
        // 预设的自动导入（如 vue、vue-router 等）
        'vue',
        'vue-router',
        // 你可以添加自定义导入
      ],
      // 自定义导入规则：将 composables/useToast 中的 showToast 自动导入
      dirs: [
        './src/composables' // 扫描该目录下的所有导出，自动按需导入
      ],
      // 或者精确指定：
      // imports: [
      //   {
      //     '@/composables/useToast': ['showToast']
      //   }
      // ],
      dts: 'src/auto-imports.d.ts', // 生成类型声明文件
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',
  }

})
