const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const User = require('./models/user');
const Post = require('./models/post');
const Tag = require('./models/tag');
const Comment = require('./models/comment');

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Tag = Tag;
db.Comment = Comment;

User.init(sequelize);
Post.init(sequelize);
Tag.init(sequelize);
Comment.init(sequelize);

User.associate(db);
Post.associate(db);
Tag.associate(db);
Comment.associate(db);

module.exports = db;
