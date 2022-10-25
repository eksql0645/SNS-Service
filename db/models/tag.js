const Sequelize = require('sequelize');

module.exports = class Tag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        tag: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Tag',
        tableName: 'tags',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }
  static associate(db) {
    db.Tag.belongsToMany(db.Post, {
      through: 'PostTag',
      targetKey: 'id',
      foreignKey: 'tagId',
      onDelete: 'CASCADE',
    });
    db.Tag.belongsTo(db.User, {
      foreignKey: 'tagUserId',
      targetKey: 'id',
    });
  }
};
