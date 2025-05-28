schema "public" {
  comment = "RefURL application schema"
}

table "users" {
  schema = schema.public
  column "id" {
    type = bigint
    identity {}
  }
  column "email" {
    type = varchar(255)
    null = false
  }
  column "password" {
    type = varchar(255)
    null = false
  }
  column "name" {
    type = varchar(255)
    null = false
  }
  column "created_at" {
    type = timestamp
    null = false
    default = sql("CURRENT_TIMESTAMP")
  }
  column "updated_at" {
    type = timestamp
    null = false
    default = sql("CURRENT_TIMESTAMP")
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
    type = bigint
    identity {}
  }
  column "owner" {
    type = bigint
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
    type = bigint
    null = false
    default = 0
  }
  column "created_at" {
    type = timestamp
    null = false
    default = sql("CURRENT_TIMESTAMP")
  }
  column "clicks_at" {
    type = timestamp
    null = false
    default = sql("CURRENT_TIMESTAMP")
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "fk_user" {
    columns = [column.owner]
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
    type = bigint
    identity {}
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
  }
  index "idx_config_name" {
    unique = true
    columns = [column.CONFIG_NAME]
  }
}