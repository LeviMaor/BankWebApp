const verifyRoles = require('./verifyRoles');

const verifyUser = verifyRoles('User');

module.exports = verifyUser;
