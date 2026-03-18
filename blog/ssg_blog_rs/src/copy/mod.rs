mod copy_source_error;

use std::error::Error;
use std::path::{Path, PathBuf};
use std::fs;
use super::templates_config::config::SSGBlogConfig;
use copy_source_error::CopySourceError;

const SOURCE_DIR: &'static str = "templates";

pub fn copy_templates(config: &SSGBlogConfig) -> Result<(), Box<dyn Error>> {
    if fs::exists(&config.out_dir)? {
        fs::remove_dir_all(&config.out_dir)
            .map_err(|e| CopySourceError(PathBuf::from(&config.out_dir), Box::new(e)))?;
    }

    copy_dir_recursive(&PathBuf::from(SOURCE_DIR), &PathBuf::from(&config.out_dir))?;

    Ok(())
}

fn copy_dir_recursive(source_dir: &Path, target_dir: &Path) -> Result<(), Box<dyn Error>> {
    fs::create_dir(target_dir)
        .map_err(|e| CopySourceError(target_dir.to_path_buf(), Box::new(e)))?;

    for entry in fs::read_dir(source_dir)? {
        let entry = entry?;
        let file_type = entry.file_type()?;
        let file_name  = entry.file_name();

        let source_file_path = source_dir.join(&file_name);
        let target_file_path = target_dir.join(&file_name);

        if file_type.is_file() {
            fs::copy(&source_file_path, &target_file_path)
                .map_err(|e| CopySourceError(source_file_path.clone(), Box::new(e)))?;
        } else if file_type.is_dir() {
            copy_dir_recursive(&source_file_path, &target_file_path)?;
        }
    }
    
    Ok(())
}
