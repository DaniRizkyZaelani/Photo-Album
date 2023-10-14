const router = require('express').Router();
const UserController = require('../controllers/UserControler');

router.get('/', UserController.getUsers);

module.exports = router;