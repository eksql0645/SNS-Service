const { Router } = require('express');
const router = Router();
const userRouter = require('./user');
const postRouter = require('./post');
const authRouter = require('./auth');
const refreshRouter = require('./refresh');
const imageRouter = require('./image');

router.use('/users', userRouter);
router.use('/tokens', refreshRouter);
router.use('/posts', postRouter);
router.use('/auth', authRouter);
router.use('/img', imageRouter);

module.exports = router;
