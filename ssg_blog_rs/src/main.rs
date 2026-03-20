mod config;
mod template;
mod post_gen;
mod copy;
mod params;

use std::error::Error;
use config::SSGBlogConfig;
use post_gen::{generate_posts_to_content, generate_posts_to_files};
use template::insert_content_into_templates;
use copy::{clean_dir, copy_templates, copy_assets, move_posts};

fn main() -> Result<(), Box<dyn Error>> {
    let config_path = SSGBlogConfig::search_config_file()?;
    let config = SSGBlogConfig::parse_config(&config_path)?;

    let posts_content = generate_posts_to_content(config.posts_per_load_count)?;
    let pattern_to_content_map = config.get_pattern_to_content(posts_content);

    generate_posts_to_files(config.posts_per_load_count)?;

    clean_dir(&config.out_dir)?;
    copy_templates(&config.out_dir)?;
    copy_assets(&config.out_dir)?;
    move_posts(&config.out_dir)?;

    insert_content_into_templates(&config.out_dir, pattern_to_content_map)?;

    Ok(())
}  
