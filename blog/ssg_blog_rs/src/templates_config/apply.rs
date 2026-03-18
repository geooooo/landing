use std::error::Error;
use std::path::PathBuf;
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::{BufRead, BufReader, Write};
use maplit::hashmap;
use regex::Regex;
use super::config::SSGBlogConfig;

const TEMPLATE_NAMES: [&'static str; 1] = [
    "index.html",
];
const TEMP_NAME_POSTFIX: &'static str = "tmp";

pub fn apply_config_for_templates(config: &SSGBlogConfig) -> Result<(), Box<dyn Error>> {
    let pattern_to_content_map: HashMap<&str, String> = config.try_into()?;
    let pattern = Regex::new(r"\{\{([\d\w.]+)\}\}")?;

    for template_name in TEMPLATE_NAMES {
        let template_name = PathBuf::from(&config.out_dir).join(template_name);

        apply_config_for_template(&template_name, &pattern, &pattern_to_content_map)?;
    }

    Ok(())
}

fn apply_config_for_template(template_name: &PathBuf, pattern: &Regex, pattern_to_content_map: &HashMap<&str, String>) -> Result<(), Box<dyn Error>> {
    let mut temp_template_name = template_name.clone();
    temp_template_name.add_extension(TEMP_NAME_POSTFIX);

    let template_file = File::open(&template_name)?;
    let mut temp_template_file = File::create(&temp_template_name)?;
    let mut reader = BufReader::new(&template_file);

    loop {
        let mut line = String::new();
        let len = reader.read_line(&mut line)?;

        if len == 0 {
            break
        }

        // print!("line: {line}");
        // let x = pattern.find(&line);
        // if x.is_some() {
        //     println!("{:?}", x.unwrap().);
        // }
        // // if x.is_some() {
            
        // //     println!("{:?}", y);
        // // }
        
        
        // let _ = std::io::stdin().read_line(&mut String::new());


        if let Some(captures) = pattern.captures(&line) && 
           let (Some(match0), Some(match1)) = (captures.get(0), captures.get(1)) && 
           let Some(content) = pattern_to_content_map.get(match1.as_str())
        {
            line = line.replace(match0.as_str(), content);
        }

        temp_template_file.write_all(line.as_bytes())?;
    }

    drop(template_file);
    fs::remove_file(&template_name)?;
    fs::rename(&temp_template_name, &template_name)?;

    Ok(())
}

impl Into<HashMap<&'static str, String>> for &SSGBlogConfig {
    fn into(self) -> HashMap<&'static str, String> {
        let nav_item_template = r"
            <li>
                <a href='{0}'>{1}</a>
            </li>
        ";
        let footer_nav_group_template = r"
            <div class='contacts'>
                <h3 class='contacts-header'>{0}:</h3>
                <ul class='contacts-list'>{1}</ul>
            </div>
        ";

        let mut header_nav_items = String::new();
        for (text, link) in &self.header.nav {
            let header_nav_item = nav_item_template
                .replace("{0}", text)
                .replace("{1}", link);
            header_nav_items.push_str(&header_nav_item);
        }

        let mut footer_nav_groups = String::new();
        for (group_title, links) in &self.footer.nav {
            let mut footer_nav_group_items = String::new();
            for (text, link) in links {
                let footer_nav_item = nav_item_template
                    .replace("{0}", text)
                    .replace("{1}", link);
                footer_nav_group_items.push_str(&footer_nav_item);
            }

            let footer_nav_group = footer_nav_group_template
                .replace("{0}", group_title)
                .replace("{1}", &footer_nav_group_items);
            footer_nav_groups.push_str(&footer_nav_group);
        }

        hashmap! {
            "title" => self.title.to_owned(),
            "postsPerLoadCount" => self.posts_per_load_count.to_owned(),
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