mod config;
mod template;
mod post_gen;
mod copy;

use std::error::Error;
use config::SSGBlogConfig;
use post_gen::generate_first_posts;
use template::insert_content_into_templates;
use copy::{clean_dir, copy_templates};
/*
http server
precache posts
worker pool for gen
*/
fn main() -> Result<(), Box<dyn Error>> {
    let config_path = SSGBlogConfig::search_config_file()?;
    let config = SSGBlogConfig::parse_config(&config_path)?;

    let posts_content = generate_first_posts(config.posts_per_load_count);
    let pattern_to_content_map = config.get_pattern_to_content(posts_content);

    clean_dir(&config.out_dir)?;
    copy_templates(&config.out_dir)?;

    insert_content_into_templates(&config.out_dir, pattern_to_content_map)?;

    //generate_posts
    //copy_posts

    Ok(())
}  
