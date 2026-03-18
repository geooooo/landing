use std::collections::HashMap;
use serde::{Deserialize};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SSGBlogConfig {
    pub out_dir: String,
    pub posts_per_load_count: String,
    pub title: String,
    pub icons_dir: String,
    pub header: HeaderConfig,
    pub footer: FooterConfig,
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
    pub nav: HashMap<String, HashMap<String, String>>,
}
