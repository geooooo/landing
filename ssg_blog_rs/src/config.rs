use std::collections::HashMap;
use std::fs;
use std::env;
use std::path::PathBuf;
use std::error::Error;
use std::fmt::{Display, Debug};
use maplit::hashmap;
use serde::{Deserialize};

const NAV_ITEM_TEMPLATE: &'static str = r"
    <li>
        <a href='{0}'>{1}</a>
    </li>
";

const FOOTER_NAV_MULTI_GROUP_TEMPLATE: &'static str = r"
    <div class='contacts'>
        <h3 class='contacts-header'>{0}:</h3>
        <ul class='contacts-list'>{1}</ul>
    </div>
";

const FOOTER_NAV_SINGLE_GROUP_TEMPLATE: &'static str = r"
    <div class='contacts'>
        <h3 class='contacts-header'>
            {0}:
            <a href='{1}'>{2}</a>
        </h3>
    </div>
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
    pub footer: FooterConfig,
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
        for (text, link) in &self.header.nav {
            let nav_item = NAV_ITEM_TEMPLATE
                .replace("{0}", link)
                .replace("{1}", text);
            header_nav_items.push_str(&nav_item);
        }

        let mut footer_nav_groups = String::new();
        for group in &self.footer.nav {
            let nav_group;

            if group.links.len() == 1 {
                let keys: Vec<&String> = group.links.keys().collect();
                let (text, link) = (keys[0], &group.links[keys[0]]);

                nav_group = FOOTER_NAV_SINGLE_GROUP_TEMPLATE
                    .replace("{0}", &group.group)
                    .replace("{1}", link)
                    .replace("{2}", text);
            } else {
                let mut nav_group_items = String::new();

                for (text, link) in &group.links {
                    let nav_item = NAV_ITEM_TEMPLATE
                        .replace("{0}", link)
                        .replace("{1}", text);
                    nav_group_items.push_str(&nav_item);
                }

                nav_group = FOOTER_NAV_MULTI_GROUP_TEMPLATE
                    .replace("{0}", &group.group)
                    .replace("{1}", &nav_group_items);
            }

            footer_nav_groups.push_str(&nav_group);
        }

        hashmap! {
            "title" => self.title.to_owned(),
            "postsPerLoadCount" => self.posts_per_load_count.to_string(),
            "iconsDir" => self.icons_dir.to_owned(),
            "header.h1" => self.header.h1.to_owned(),
            "header.h2" => self.header.h2.to_owned(),
            "header.animations.firstImgPath" => self.header.animations.first_img_path.to_owned(),
            "header.animations.secondImgPath" => self.header.animations.second_img_path.to_owned(),
            "header.nav" => header_nav_items,
            "footer.nav" => footer_nav_groups,
        }
    }
}

#[derive(Deserialize)]
pub struct HeaderConfig {
    pub h1: String,
    pub h2: String,
    pub animations: AnimationsConfig,
    pub nav: HashMap<String, String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnimationsConfig {
    pub first_img_path: String,
    pub second_img_path: String,
}

#[derive(Deserialize)]
pub struct FooterConfig {
    pub nav: Vec<FooterNavGroupConfig>,
}

#[derive(Deserialize)]
pub struct FooterNavGroupConfig {
    pub group: String,
    pub links: HashMap<String, String>,
}


