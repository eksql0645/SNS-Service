const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.STRING(60),
          allowNull: false,
          primaryKey: true,
        },
        role: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        nick: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(45),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(70),
          allowNull: false,
        },
        info: {
          type: Sequelize.STRING(150),
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'User',
        tableName: 'users',
        paranoid: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Post, {
      foreignKey: 'post_userId',
      sourceKey: 'id',
    });
    db.User.hasMany(db.Comment, {
      foreignKey: 'com_userId',
      sourceKey: 'id',
    });
  }
};
