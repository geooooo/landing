mod templates_config;
mod copy;

use std::error::Error;
use std::env;
use templates_config::{
    parse::parse_config,
    apply::apply_config_for_templates,
};
use copy::copy_templates;
/*
img preview land and blog
http server
precache posts
worker pool for gen
*/
fn main() -> Result<(), Box<dyn Error>> {
    let args = env::args().skip(1).collect::<Vec<String>>();
    let config_path = &args[0];
    
    let config = parse_config(config_path)?;
    copy_templates(&config)?;
    apply_config_for_templates(&config)?;

    Ok(())
}  
