schema "public" {
    comment = "Main schema for RefURL"
}

table "users" {
  schema = schema.public
  column "id" {
    type = int
    auto_increment = true
  }
  column "email" {
    type = varchar(255)
    null = false
  }
  column "name" {
    type = varchar(255)
    null = false
  }
  column "created_at" {
    type = timestamp
    default = sql("CURRENT_TIMESTAMP")
  }
  column "updated_at" {
    type = timestamp
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
  }
  primary_key {
    columns = [column.id]
  }
  index "idx_email" {
    unique = true
    columns = [column.email]
  }
}

table "urls" {
  schema = schema.public
  column "id" {
    type = int
    auto_increment = true
  }
  column "owner" {
    type = int
    null = true
  }
  column "original_url" {
    type = text
    null = false
  }
  column "short_code" {
    type = varchar(10)
    null = false
  }
  column "title" {
    type = varchar(255)
    null = true
  }
  column "clicks" {
    type = int
    default = 0
  }
  column "created_at" {
    type = timestamp
    default = sql("CURRENT_TIMESTAMP")
  }
  column "clicks_at" {
    type = timestamp
    default = sql("CURRENT_TIMESTAMP")
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "fk_user" {
    columns = [column.user_id]
    ref_columns = [table.users.column.id]
    on_delete = SET_NULL
  }
  index "idx_short_code" {
    unique = true
    columns = [column.short_code]
  }
}

table "configs" {
  schema = schema.public
  column "id" {
    type = int
    auto_increment = true
  }
  column "CONFIG_NAME" {
    type = varchar(255)
    null = false
  }
  column "CONFIG_VALUE" {
    type = varchar(255)
    null = false
  }
  primary_key {
    columns = [column.id]
    name = "pk_config"
  }
  index "idx_config_name" {
    unique = true
    columns = [column.CONFIG_NAME]
  }
}
