const verifyRoles = require('./verifyRoles');

const verifyAdmin = verifyRoles('Admin');

module.exports = verifyAdmin;
