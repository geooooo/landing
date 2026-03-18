// styles.css assetsDir

use std::error::Error;
use std::path::{Path, PathBuf};
use std::env;
use std::fs;
use ssg_blog_rs::copy::CopySourceError;

fn copy_dir<P: AsRef<Path>>(source_dir: P, target_dir: P) -> Result<(), Box<dyn Error>> {
    let source_dir = source_dir.as_ref();
    let target_dir = target_dir.as_ref();

    fs::create_dir(target_dir)
        .map_err(|_| CopySourceError(target_dir.to_path_buf()))?;

    for entry in fs::read_dir(source_dir)? {
        let entry = entry?;
        let file_type = entry.file_type()?;
        let file_name  = entry.file_name();

        let source_file_path = source_dir.join(&file_name);
        let target_file_path = target_dir.join(&file_name);

        if file_type.is_file() {
            fs::copy(&source_file_path, &target_file_path)
                .map_err(|_| CopySourceError(source_file_path.clone()))?;
        } else if file_type.is_dir() {
            copy_dir(&source_file_path, &target_file_path)?;
        }
    }
    
    Ok(())
}

fn main() -> Result<(), Box<dyn Error>> {
    let args = env::args().skip(1).collect::<Vec<String>>();
    let source_dir = &args[0];
    let target_dir = &args[1];

    if fs::exists(target_dir)? {
        fs::remove_dir_all(target_dir)
            .map_err(|_| CopySourceError(PathBuf::from(target_dir)))?;
    }

    copy_dir(source_dir, target_dir)?;

    Ok(())
}