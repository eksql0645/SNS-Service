const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.STRING(60),
          allowNull: false,
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING(60),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        writer: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
        image: {
          type: Sequelize.STRING(60),
          allowNull: true,
          defaultValue: null,
        },
        weather: {
          type: Sequelize.STRING(45),
          allowNull: true,
          defaultValue: null,
        },
        like: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        hits: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Post',
        tableName: 'posts',
        paranoid: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }
  static associate(db) {
    db.Post.belongsTo(db.User, {
      foreignKey: 'postUserId',
      targetKey: 'id',
    });
    db.Post.hasMany(db.Comment, {
      foreignKey: 'postId',
      sourceKey: 'id',
    });
    db.Post.belongsToMany(db.Tag, {
      as: 'tag',
      through: 'PostTag',
      targetKey: 'id',
      foreignKey: 'postId',
    });
  }
};
