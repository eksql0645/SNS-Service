const { Router } = require('express');
const router = Router();
const userRouter = require('./user');
const refreshRouter = require('./refresh');

router.use('/users', userRouter);
router.use('/tokens', refreshRouter);

module.exports = router;
