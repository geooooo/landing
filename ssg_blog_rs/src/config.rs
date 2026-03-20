use std::collections::HashMap;
use std::fs;
use std::env;
use std::path::PathBuf;
use std::error::Error;
use std::fmt::{Display, Debug};
use maplit::hashmap;
use serde::{Deserialize};
use super::params::POSTS_DIR;

const NAV_ITEM_TEMPLATE: &'static str = r"
    <li>
        <a href='{0}'>{1}</a>
    </li>
";

#[derive(Debug)]
#[allow(unused)]
struct NotExistsError(PathBuf);

impl Error for NotExistsError {}

impl Display for NotExistsError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SSGBlogConfig {
    pub out_dir: String,
    pub posts_per_load_count: u8,
    pub title: String,
    pub icons_dir: String,
    pub header: HeaderConfig,
}

impl SSGBlogConfig {
    const CONFIG_FILE_NAME: &'static str = "ssg-blog.config.json";

    pub fn search_config_file() -> Result<PathBuf, Box<dyn Error>> {
        let current_dir_path = env::current_dir()?;
        let config_path = current_dir_path.join(Self::CONFIG_FILE_NAME);

        if !fs::exists(&config_path)? {
            return Err(Box::new(NotExistsError(config_path)))
        }

        Ok(config_path)
    }

    pub fn parse_config(config_path: &PathBuf) -> Result<SSGBlogConfig, Box<dyn Error>> {
        let json_content = fs::read_to_string(config_path)?;
        let config: SSGBlogConfig = serde_json::from_str(&json_content)?;

        Ok(config)
    }

    pub fn get_pattern_to_content(&self, posts_content: String) -> HashMap<&'static str, String> {
        let mut pattern_to_content: HashMap<&str, String> = self.into();
        pattern_to_content.insert("posts", posts_content);

        pattern_to_content
    }
}

impl Into<HashMap<&'static str, String>> for &SSGBlogConfig {
    fn into(self) -> HashMap<&'static str, String> {
        let mut header_nav_items = String::new();
        for pair in &self.header.nav {
            let nav_item = NAV_ITEM_TEMPLATE
                .replace("{0}", &pair[1])
                .replace("{1}", &pair[0]);
            header_nav_items.push_str(&nav_item);
        }

        let post_count = fs::read_dir(POSTS_DIR).unwrap().count() - 1;

        hashmap! {
            "title" => self.title.to_owned(),
            "postsPerLoadCount" => self.posts_per_load_count.to_string(),
            "postCount" => post_count.to_string(),
            "iconsDir" => self.icons_dir.to_owned(),
            "header.h1" => self.header.h1.to_owned(),
            "header.h2" => self.header.h2.to_owned(),
            "header.animations.firstImgPath" => self.header.animations.first_img_path.to_owned(),
            "header.animations.secondImgPath" => self.header.animations.second_img_path.to_owned(),
            "header.nav" => header_nav_items,
        }
    }
}

#[derive(Deserialize)]
pub struct HeaderConfig {
    pub h1: String,
    pub h2: String,
    pub animations: AnimationsConfig,
    pub nav: Vec<Vec<String>>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnimationsConfig {
    pub first_img_path: String,
    pub second_img_path: String,
}


