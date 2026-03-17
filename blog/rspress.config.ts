import path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  outDir: path.resolve(__dirname, "..", "dist", "blog"),
  base: '/blog/',
  lang: 'ru',
  icon: '/icon.png',
  title: "Юрий Корниенко - блог",
  themeConfig: {
    nav: [
      {
        text: "Резюме",
        link: "https://yury-kornienko.pro/",
        tag: null,
      },
    ],
    socialLinks: [
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="682.7" height="682.7" viewBox="0 0 512 512"><path d="M237 1A258 258 0 0 0 12 335a257 257 0 0 0 276 175q76-11 131-57A256 256 0 0 0 237 1m193 104 3 6-63 297q-5 3-11 1l-87-62q-6-2-13 2l-50 39q-2 1-6-1c-4-2-3 0-22-59l-14-48-41-15c-31-11-42-16-44-18q-6-7-1-12a7639 7639 0 0 1 343-133z"/><path d="m352 166-159 98q-7 5-7 14l9 34c9 33 10 36 14 33q2 0 5-21l5-24c2-5 8-10 78-74l59-56q3-6-4-4"/></svg>',
        },
        mode: 'link',
        content: 'https://t.me/yury_kornienko_one',
      },
      {
        icon: 'linkedin',
        mode: 'link',
        content: 'https://www.linkedin.com/in/yury-kornienko-one',
      },
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/geooooo',
      },
    ],
  },
});
