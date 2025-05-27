env "dev" {
  name = atlas.env
  url  = getenv("DATABASE_URL")
  
  migration {
    dir = "file://migrations"
  }
  
  diff {
    skip {
      drop_schema = true
      drop_table  = true
    }
  }
}

env "prod" {
  name = atlas.env
  url  = getenv("DATABASE_URL")
  
  migration {
    dir = "file://migrations"
  }
}
