# SSG for blog by Rust

## Shortly description

It's experimental project and still in progress,
now I am doing that for my personal blog inside my landing site

* Simple configuration
* Make your posts by Markdown
* Lazy loading posts on scroll down

## How to use

* Install Rust
* Create `ssg-blog.config.json` file in project root
* Create `posts` folder and put inside your posts as `1.md` - `N.md` files.
* Update `package.json` and add `scripts` (see below)
* Also you can check inner `templates/index.html` for information


### `ssg-blog.config.json` example

```
{
  "outDir": "dist",
  "postsPerLoadCount": "5",
  "title": "Some User - blog",
  "iconsDir": "assets/icons",
  "header": {
    "h1": "Some User - blog",
    "h2": "Software Developer",
    "animations": {
      "firstImgPath": "assets/img1.png",
      "secondImgPath": "assets/img2.png"
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

```
---
title: Header of post 1
date: 30-04-2026
images:
  - assets/posts/1/1.png
  - assets/posts/1/2.png
---

**bold**
*italic*

list:
- item1
- item2

```
const pi = 3.14;
```

[Link](https://some-site.com)
```

### Add `scripts` in your `package.json`

```
"scripts": {
    "install": "npm explore ssg_blog_rs -- npm run install",
    "build": "npm explore ssg_blog_rs -- npm run build ../ssg-blog.config.json",
    "dev": "npm explore ssg_blog_rs -- npm run dev ../ssg-blog.config.json dev"
  }
```

* install - hook for npm install
* build - single build your blog
* dev - build and watch for files change + simple localhost server to preview
