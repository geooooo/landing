use std::error::Error;
use std::path::{Path, PathBuf};
use std::fs;
use std::fmt::{Debug, Display};

const TEMPLATE_PATHS: [&'static str; 3] = [
    "node_modules/ssg_blog_rs/templates/index.html",
    "node_modules/ssg_blog_rs/templates/styles.css",
    "node_modules/ssg_blog_rs/templates/main.js",
];

const ASSETS_DIR: &'static str = "assets";

#[derive(Debug)]
#[allow(unused)]
struct CopyError(PathBuf);

impl Display for CopyError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl Error for CopyError {}

#[derive(Debug)]
#[allow(unused)]
struct CleanError(PathBuf);

impl Display for CleanError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl Error for CleanError {}

pub fn clean_dir(target_dir: &str) -> Result<(), Box<dyn Error>> {
    if fs::exists(&target_dir)? {
        fs::remove_dir_all(&target_dir)
            .map_err(|_| CleanError(PathBuf::from(target_dir)))?;
    }

    fs::create_dir(target_dir)
        .map_err(|_| CleanError(PathBuf::from(target_dir)))?;

    Ok(())
}

pub fn copy_assets(target_dir: &str) -> Result<(), Box<dyn Error>> {
    for source_template_path in TEMPLATE_PATHS {
        let source_template_path = PathBuf::from(source_template_path);
        let template_name = source_template_path.file_name().unwrap();
        let target_template_path = PathBuf::from(target_dir).join(template_name);

        fs::copy(&source_template_path, &target_template_path)
            .map_err(|_| CopyError(PathBuf::from(source_template_path)))?;
    }

    Ok(())
}

pub fn copy_templates(target_dir: &str) -> Result<(), Box<dyn Error>> {
    for source_template_path in TEMPLATE_PATHS {
        let source_template_path = PathBuf::from(source_template_path);
        let template_name = source_template_path.file_name().unwrap();
        let target_template_path = PathBuf::from(target_dir).join(template_name);

        fs::copy(&source_template_path, &target_template_path)
            .map_err(|_| CopyError(PathBuf::from(source_template_path)))?;
    }

    Ok(())
}

// copy_dir_recursive(&PathBuf::from(TEMPLATES_PATH), &PathBuf::from(&target_dir))?;
fn copy_dir_recursive(source_dir: &Path, target_dir: &Path) -> Result<(), Box<dyn Error>> {
    fs::create_dir(target_dir)
        .map_err(|_| CopyError(target_dir.to_path_buf()))?;

    for entry in fs::read_dir(source_dir)? {
        let entry = entry?;
        let file_type = entry.file_type()?;
        let file_name  = entry.file_name();

        let source_file_path = source_dir.join(&file_name);
        let target_file_path = target_dir.join(&file_name);

        if file_type.is_file() {
            fs::copy(&source_file_path, &target_file_path)
                .map_err(|_| CopyError(source_file_path))?;
        } else if file_type.is_dir() {
            copy_dir_recursive(&source_file_path, &target_file_path)?;
        }
    }
    
    Ok(())
}
