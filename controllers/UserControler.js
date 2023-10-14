const {
    User, 
    Photo
} = require('../models');

class UserController {

    static async getUsers(req, res) {
        try {
            const data = await User.findAll({
                include: Photo
            });
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

}

module.exports = UserController;