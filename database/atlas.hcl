variable "database_url" {
  type    = string
  default = getenv("DATABASE_URL")
}

variable "mysql_url" {
  type    = string
  default = getenv("MYSQL_URL")
}

variable "postgres_url" {
  type    = string
  default = getenv("POSTGRES_URL")
}

variable "sqlite_url" {
  type    = string
  default = "sqlite://./local.db"
}

env "local" {
  src = "file://schema"
  dev = "docker://mysql/8/dev"
  
  migration {
    dir = "file://migrations"
  }
  
  format {
    migrate {
      diff = "{{ sql . \"  \" }}"
    }
  }
}

env "mysql" {
  src = "file://schema"
  url = var.mysql_url
  dev = "docker://mysql/8/dev"
  
  migration {
    dir = "file://migrations/mysql"
  }
  
  diff {
    skip {
      drop_schema = true
      drop_table  = true
    }
  }
}

env "postgres" {
  src = "file://schema"
  url = var.postgres_url
  dev = "docker://postgres/15/dev?search_path=public"
  
  migration {
    dir = "file://migrations/postgres"
  }
  
  diff {
    skip {
      drop_schema = true
      drop_table  = true
    }
  }
}

env "sqlite" {
  src = "file://schema"
  url = var.sqlite_url
  
  migration {
    dir = "file://migrations/sqlite"
  }
}

env {
  name = atlas.env
  url  = var.database_url
  src  = "file://schema"
  
  migration {
    dir = "file://migrations/${atlas.env}"
  }
  
  format {
    migrate {
      apply = format(
        "{{ json . | json_merge %q }}",
        jsonencode({
          Environment: atlas.env
        })
      )
    }
  }
}