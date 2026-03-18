use std::error::Error;
use std::fs;
use std::path::PathBuf;
use serde_json;
use super::config::SSGBlogConfig;

pub fn parse_config(config_path: &str) -> Result<SSGBlogConfig, Box<dyn Error>> {
    let json_content = fs::read_to_string(config_path)?;
    let mut config: SSGBlogConfig = serde_json::from_str(&json_content)?;
    config.out_dir = PathBuf::from("..")
        .join(PathBuf::from(&config.out_dir))
        .into_os_string()
        .into_string()
        .map_err(|e| format!("{e:?}"))?;

    Ok(config)
}