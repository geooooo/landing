use std::path::PathBuf;
use std::fmt::{self, Display};
use std::error::Error;

#[derive(Debug)]
pub struct CopySourceError(pub PathBuf, pub Box<dyn Error>);


impl Display for CopySourceError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "can not copy {:?}, {:?}", self.0, self.1)
    }
}

impl Error for CopySourceError {}