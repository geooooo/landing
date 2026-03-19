# SSG for blog by Rust

It's experimental project and still in progress,
now I am doing that for my personal blog inside my [landing site](https://github.com/geooooo/landing)

## Shortly description

* Simple configuration
* Single build
* Make your posts by simple format and text files
* Lazy loading posts on scroll down

## Future and ideas

* Extends MD format for posts
* Multithread build
* Incremental build, maybe need precache builded parts to improve build performance
* `ssg_blog_rs dev` mod for watch + simple localhost server for preview and development

## How to use

* Install `Rust`
* Install `ssg_blog_rs` package
* Update `package.json` and add `scripts` section
* Prepare your assets with images (site icons, posts pictures) and put into `assets` folder
* Create `ssg-blog.config.json` file in project root
* Create `posts` folder and put inside your posts as `1.md` - `N.md` files.
  
### Add `scripts` in your `package.json`

```json
"scripts": {
  "build": "ssg_blog_rs build"
}
```

* build - single build your blog

### Recommended to `assets` folder structure

```raw
assets/
 - icons/
 - animations/
 -- img1.png
 -- img2.png
 - posts/
 -- 1/
 ---- 1.png
 ---- 2.png
 -- 2/
 ---- 1.png
```

#### `icons/` - You need next icons

* `apple-touch-icon.png`
* `favicon-32x32.png`
* `favicon-16x16.png`
* `favicon.ico`
* `android-chrome-192x192.png`
* `android-chrome-512x512.png`
* `site.webmanifest`

##### `site.webmanifest` - Example

```json
{
    "name": "",
    "short_name": "",
    "icons": [
        {
            "src": "/assets/icons/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/assets/icons/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone"
}
```

### `ssg-blog.config.json` example

```json
{
  "outDir": "dist",
  "postsPerLoadCount": "5",
  "title": "Some User - blog",
  "iconsDir": "assets/icons",
  "header": {
    "h1": "Some User - blog",
    "h2": "Software Developer",
    "animations": {
      "firstImgPath": "assets/animations/img1.png",
      "secondImgPath": "assets/animations/img2.png"
    },
    "nav": {
      "CV": "https://some-site.com/",
      "Contacts": "#contacts"
    }
  },
  "footer": {
    "nav": [
      {
        "group": "Social",
        "links": {
          "Telegram": "https://t.me/some-user",
          "Instagram": "https://www.instagram.com/some-user/"
        }
      },
      {
        "group": "Github",
        "links": {
          "some-user": "https://github.com/some-user"
        }
      }
    ]
  }
}
```

### Posts and what supports

```md
---
title: Header of post 1
date: 30-04-2026
images:
  - assets/posts/1/1.png
  - assets/posts/1/2.png
---

some text
```
