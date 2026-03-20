pub const ASSETS_DIR: &'static str = "assets";
pub const POSTS_DIR: &'static str = "posts";

pub const TEMPLATE_NAMES: [&'static str; 1] = [
    "index.html",
];
pub const TEMPLATE_PATHS: [&'static str; 3] = [
    "node_modules/ssg_blog_rs/templates/index.html",
    "node_modules/ssg_blog_rs/templates/styles.css",
    "node_modules/ssg_blog_rs/templates/main.js",
];

pub const POSTS_TEMP_DIR_PATH: &'static str = "node_modules/.ssg_blog_rs_posts_temp";
pub const TEMP_NAME_POSTFIX: &'static str = "tmp";