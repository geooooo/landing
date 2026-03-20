use std::error::Error;
use std::fs;
use std::path::PathBuf;
use std::fmt::{Debug, Display};
use std::io::{BufRead, BufReader};
use super::params::{POSTS_DIR, POSTS_TEMP_DIR_PATH};

const POST_TEMPLATE: &'static str = r"
    <article class='post'>
        <header class='post-header'>
            <h3 class='post-title'>{0}</h3>
            <div class='post-date'>{1}</div>
        </header>

        <main class='post-content'>{2}</main>
        {3}
    </article>
";

const POST_FOOTER_TEMPLATE: &'static str = r"<footer class='post-footer'>{0}</footer>";

const POST_IMG_TEMPLATE: &'static str = r"
    <div class='preview-container'>
        <img src='{0}' alt=''>
    </div>
";

const POST_SEP_TEMPLATE: &'static str = "<div class='join-line'></div>";

#[derive(Default, Debug)]
struct PostData {
    title: String,
    date: String,
    images: Vec<String>,
    content: String,
}

#[derive(Debug)]
#[allow(unused)]
struct GenError(PathBuf);

impl Display for GenError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl Error for GenError {}

pub fn generate_posts_to_content(count: u8) -> Result<String, Box<dyn Error>> {
    let mut contents: Vec<String> = vec![];

    for number in 1..=count as u32  {
        let post_data = parse_post_file(number)?;
        let post_content = generate_post(post_data);

        contents.push(post_content);
    }

    Ok(contents.join(POST_SEP_TEMPLATE))
}

pub fn generate_posts_to_files(done_count: u8) -> Result<(), Box<dyn Error>> {
    if fs::exists(POSTS_TEMP_DIR_PATH)? {
        fs::remove_dir_all(POSTS_TEMP_DIR_PATH)?;
    }

    fs::create_dir(POSTS_TEMP_DIR_PATH)?;
    
    let start_number = done_count as u32 + 1;
    let post_count = fs::read_dir(POSTS_DIR)?.count() as u32  - 1;
    for number in start_number..=post_count {
        let post_data = parse_post_file(number)?;
        let post_content = generate_post(post_data);

        let post_file_path = PathBuf::from(POSTS_TEMP_DIR_PATH).join(format!("{number}.html"));
        fs::write(&post_file_path, post_content)?;
    }
    
    Ok(())
}

fn parse_post_file(number: u32) -> Result<PostData, Box<dyn Error>> {
    let mut post_data = PostData::default();
    
    let post_file_name = format!("{number}.md");
    let post_file_path = PathBuf::from(POSTS_DIR).join(post_file_name);

    let file = fs::File::open(&post_file_path)
        .map_err(|_| GenError(post_file_path))?;
    let mut reader = BufReader::new(&file);

    reader.read_line(&mut String::new())?;

    let mut line = String::new();
    reader.read_line(&mut line)?;
    post_data.title = line
        .split("title:")
        .collect::<Vec<&str>>()[1]
        .trim()
        .to_string();

    let mut line = String::new();
    reader.read_line(&mut line)?;
    post_data.date = line
        .split("date:")
        .collect::<Vec<&str>>()[1]
        .trim()
        .to_string();

    let mut line = String::new();
    reader.read_line(&mut line)?;
    if line.contains("images:") {
        loop {
            let mut line = String::new();
            reader.read_line(&mut line)?;
            let line = line.trim();

            if line == "---" {
                break;
            }

            let image = line.split("-")
                .collect::<Vec<&str>>()[1]
                .trim();
            post_data.images.push(image.to_string());
        }
    }

    let mut lines: Vec<String> = vec!["<p>".to_string()];
    loop {
        let mut line = String::new();
        let len = reader.read_line(&mut line)?;

        if len == 0 {
            break;
        }

        let line = line.trim();
        if line.is_empty() {
            lines.push("</p><p>".to_string());
        }

        lines.push(line.to_string());
    }

    lines.push("</p>".to_string());
    post_data.content = lines.join("\n");

    Ok(post_data)
}

fn generate_post(post_data: PostData) -> String {
    let images_content = POST_FOOTER_TEMPLATE.replace(
        "{0}", 
        &post_data.images
                .iter()
                .map(|image| POST_IMG_TEMPLATE.replace("{0}", image))
                .collect::<Vec<String>>()
                .join(""),
    );

    POST_TEMPLATE
        .replace("{0}", &post_data.title)
        .replace("{1}", &post_data.date)
        .replace("{2}", &post_data.content)
        .replace("{3}", if post_data.images.is_empty() { "" } else { &images_content })
        .to_string()
}