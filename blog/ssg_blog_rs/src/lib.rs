pub mod copy {
    use std::error::Error;
    use std::fmt::{self, Display, Debug};
    use std::path::{PathBuf};

    #[derive(Debug)]
    pub struct CopySourceError(pub PathBuf);


    impl Display for CopySourceError {
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> fmt::Result {
            write!(f, "can not copy {:?}", self.0)
        }
    }

    impl Error for CopySourceError {}
}
