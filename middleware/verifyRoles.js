const verifyRoles = (role) => {
    return (req, res, next) => {
        if (!req?.user?.roles) {
            return res.sendStatus(403); // Forbidden
        }
        
        const normalizedRole = role.toLowerCase();
        const result = req.user.roles.some(userRole => userRole.toLowerCase() === normalizedRole);

        if (!result) return res.sendStatus(403); // Forbidden
        next();
    };
};

module.exports = verifyRoles;
