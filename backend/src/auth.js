const connection = require('./DBAccess');
const jwt = require('jsonwebtoken');
const { jwtOptions } = require('../config');

// TODO : check if fields are null
function auth(username, password) {
    return connection.getUser({username, password}).then((data) => {
        if (null === data)
            throw new Error("Not found");
        const token = jwt.sign({ userId: data._id, username: data.username }, jwtOptions.secret);
        return { token, user: data };
    });
}

// TODO : check if fields are null
// TODO : register in DB if everything is good
function register(args = {username, email, firstname, lastname, birthdate, password, avatarImg}) {
    
}

module.exports = { auth, register };