use std::error::Error;
use std::path::PathBuf;
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::{BufRead, BufReader, Write};
use regex::Regex;

const TEMPLATE_NAMES: [&'static str; 1] = [
    "index.html",
];
const TEMP_NAME_POSTFIX: &'static str = "tmp";

pub fn insert_content_into_templates(
    target_dir: &str, 
    pattern_to_content_map: HashMap<&str, String>,
) -> Result<(), Box<dyn Error>> {
    let pattern = Regex::new(r"\{\{([\d\w.]+)\}\}")?;

    for template_name in TEMPLATE_NAMES {
        let template_path = PathBuf::from(target_dir).join(template_name);

        insert_content_into_template(&template_path, &pattern, &pattern_to_content_map)?;
    }

    Ok(())
}

fn insert_content_into_template(
    template_path: &PathBuf, 
    pattern: &Regex, 
    pattern_to_content_map: &HashMap<&str, String>,
) -> Result<(), Box<dyn Error>> {
    let mut temp_template_path = template_path.clone();
    temp_template_path.add_extension(TEMP_NAME_POSTFIX);

    let template_file = File::open(&template_path)?;
    let mut temp_template_file = File::create(&temp_template_path)?;
    let mut reader = BufReader::new(&template_file);

    loop {
        let mut line = String::new();
        let len = reader.read_line(&mut line)?;

        if len == 0 {
            break
        }

        if let Some(captures) = pattern.captures(&line) && 
           let (Some(match0), Some(match1)) = (captures.get(0), captures.get(1)) && 
           let Some(content) = pattern_to_content_map.get(match1.as_str())
        {
            line = line.replace(match0.as_str(), content);
        }

        temp_template_file.write_all(line.as_bytes())?;
    }

    drop(template_file);
    fs::remove_file(&template_path)?;
    fs::rename(&temp_template_path, &template_path)?;

    Ok(())
}