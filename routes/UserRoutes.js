const router = require('express').Router();
const UserController = require('../controllers/UserControler');

router.get('/', UserController.getUsers);
router.post('/register', UserController.register);
router.post('/login', UserController.login);

module.exports = router;