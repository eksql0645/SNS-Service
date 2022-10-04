const Sequelize = require('sequelize');

module.exports = class Tag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.STRING(60),
          allowNull: false,
          primaryKey: true,
        },
        tag: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Tag',
        tableName: 'tags',
        paranoid: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }
  static associate(db) {
    db.Tag.belongsToMany(db.Post, {
      as: 'post',
      through: 'PostTag',
      targetKey: 'id',
      foreignKey: 'tagId',
    });
  }
};
