
module.exports = (req, res, next) => {
    if (req.userData.type == 1) {
        next()
    } else {
        return res.status(403).json({
            message: 'Forbidden'
        });
    }
}