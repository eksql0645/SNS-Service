const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        group: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        parentId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        comment: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'Comment',
        tableName: 'comments',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }
  static associate(db) {
    db.Comment.belongsTo(db.User, {
      foreignKey: 'comUserId',
      targetKey: 'id',
    });
    db.Comment.belongsTo(db.Post, {
      foreignKey: 'postId',
      targetKey: 'id',
    });
  }
};
