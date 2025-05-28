import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UrlAttributes {
  id: number;
  owner?: number;
  originalUrl: string;
  shortCode: string;
  title?: string;
  clicks: number;
  createdAt: Date;
  clicksAt: Date;
}

interface UrlCreationAttributes extends Optional<UrlAttributes, 'id' | 'clicks' | 'createdAt' | 'clicksAt'> {}

export class Url extends Model<UrlAttributes, UrlCreationAttributes> implements UrlAttributes {
  public id!: number;
  public owner!: number;
  public originalUrl!: string;
  public shortCode!: string;
  public title!: string;
  public clicks!: number;
  public createdAt!: Date;
  public clicksAt!: Date;

  public readonly updatedAt!: Date;

  // Add static methods
  public static async findByShortCode(shortCode: string): Promise<Url | null> {
    return this.findOne({ where: { shortCode } });
  }

  public static async findByOwner(ownerId: number): Promise<Url[]> {
    return this.findAll({ 
      where: { owner: ownerId },
      order: [['createdAt', 'DESC']]
    });
  }
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
    originalUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shortCode: {
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    clicksAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'urls',
    modelName: 'Url',
  }
);

export default Url; 