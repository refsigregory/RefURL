import { Model, DataTypes } from 'sequelize';
import { UrlAttributes } from '../types/url.types';
import sequelize from '../config/database';

class Url extends Model<UrlAttributes> implements UrlAttributes {
  public id!: number;
  public owner!: number | null;
  public original_url!: string;
  public short_code!: string;
  public title!: string | null;
  public clicks!: number;
  public created_at!: Date;
  public clicks_at!: Date;
}

Url.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    owner: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    original_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    short_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    clicks: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    clicks_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'urls',
    modelName: 'Url',
    timestamps: false,
    underscored: true,
  }
);

export default Url;
