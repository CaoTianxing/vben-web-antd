
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { createHtmlPlugin as viteHtmlPlugin } from 'vite-plugin-html';
import { viteExtraAppConfigPlugin } from './internal/vite-config/src/plugins/extra-app-config';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompressPlugin from 'vite-plugin-compression';
import { viteInjectAppLoadingPlugin } from './internal/vite-config/src/plugins/inject-app-loading';
import { viteMetadataPlugin } from './internal/vite-config/src/plugins/inject-metadata';
// 其他插件如有需要可继续引入
import path from 'path';

export default defineConfig(async ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const isBuild = command === 'build';

  return {
    resolve: {
      alias: [
        // 这里插入你的路径别名
        { find: '@vben-core/shadcn-ui', replacement: path.resolve(__dirname, 'libs/@core/ui-kit/shadcn-ui/src') },
        { find: '@vben-core/form-ui', replacement: path.resolve(__dirname, 'libs/@core/ui-kit/form-ui/src') },
        { find: '@vben-core/popup-ui', replacement: path.resolve(__dirname, 'libs/@core/ui-kit/popup-ui/src') },
        { find: '@vben-core/menu-ui', replacement: path.resolve(__dirname, 'libs/@core/ui-kit/menu-ui/src') },
        { find: '@vben-core/layout-ui', replacement: path.resolve(__dirname, 'libs/@core/ui-kit/layout-ui/src') },
        { find: '@vben-core/tabs-ui', replacement: path.resolve(__dirname, 'libs/@core/ui-kit/tabs-ui/src') },
        { find: '@vben-core/composables', replacement: path.resolve(__dirname, 'libs/@core/composables/src') },
        { find: '@vben-core/preferences', replacement: path.resolve(__dirname, 'libs/@core/preferences/src') },
        { find: '@vben-core/typings', replacement: path.resolve(__dirname, 'libs/@core/base/typings/src') },
        { find: /^@vben-core\/shared\/(.*)$/, replacement: path.resolve(__dirname, 'libs/@core/base/shared/src/$1') },
        { find: '@vben/access', replacement: path.resolve(__dirname, 'libs/effects/access/src') },
        { find: '@vben/constants', replacement: path.resolve(__dirname, 'libs/constants/src') },
        { find: '@vben/hooks', replacement: path.resolve(__dirname, 'libs/effects/hooks/src') },
        { find: '@vben/icons', replacement: path.resolve(__dirname, 'libs/icons/src') },
        { find: '@vben/locales', replacement: path.resolve(__dirname, 'libs/locales/src') },
        { find: '@vben/preferences', replacement: path.resolve(__dirname, 'libs/preferences/src') },
        { find: '@vben/stores', replacement: path.resolve(__dirname, 'libs/stores/src') },
        { find: '@vben/types', replacement: path.resolve(__dirname, 'libs/types/src') },
        { find: '@vben/utils', replacement: path.resolve(__dirname, 'libs/utils/src') },
        { find: '@vben/request', replacement: path.resolve(__dirname, 'libs/effects/request/src') },
        { find: '@vben/common-ui/es/loading', replacement: path.resolve(__dirname, 'libs/effects/common-ui/src/components/loading') },
        { find: '@vben/common-ui/es/tippy', replacement: path.resolve(__dirname, 'libs/effects/common-ui/src/components/tippy') },
        { find: '@vben/common-ui', replacement: path.resolve(__dirname, 'libs/effects/common-ui/src') },
        { find: '@vben/layouts', replacement: path.resolve(__dirname, 'libs/effects/layouts/src') },
        { find: '@vben/styles', replacement: path.resolve(__dirname, 'libs/styles/src') },
        { find: /^@vben\/common-ui\/(.*)$/, replacement: path.resolve(__dirname, 'libs/effects/common-ui/src/$1') },
        { find: /^@vben\/plugins\/(.*)$/, replacement: path.resolve(__dirname, 'libs/effects/plugins/src/$1') },
        { find: /^@\/(.*)$/, replacement: path.resolve(__dirname, 'src/$1') },
        { find: /^~\/(.*)$/, replacement: path.resolve(__dirname, 'mock/$1') },
        { find: '@vben/tailwind-config', replacement: path.resolve(__dirname, 'internal/tailwind-config/src') },
        { find: '@vben/node-utils', replacement: path.resolve(__dirname, 'internal/node-utils/src') },
        { find: '@vben/types/global', replacement: path.resolve(__dirname, 'libs/types/global.d.ts') },
        { find: '@vben-core/icons', replacement: path.resolve(__dirname, 'libs/@core/base/icons/src') }
      ]
    },
    plugins: [
      vue(),
      vueJsx(),
      await viteInjectAppLoadingPlugin(isBuild, env, 'loading.html'),
      await viteMetadataPlugin(),
      viteHtmlPlugin({ minify: isBuild }),
      command === 'build' && await viteExtraAppConfigPlugin({ isBuild: true, root: process.cwd() }),
      isBuild && viteCompressPlugin({ ext: '.gz', deleteOriginFile: false }),
      // 其他插件如 PWA、i18n、mock、importmap 可按需添加
    ].filter(Boolean),
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5320/api',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
          ws: true,
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/index-[name]-[hash].js',
        }
      },
      target: 'es2015',
      chunkSizeWarningLimit: 2000,
      reportCompressedSize: false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 如需全局样式注入可在此配置
        }
      }
    }
  };
});
