const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified || !verified.data)
            return res.status(422).json({ success: false, msg: "Invalid token." });
        next();
    } catch (error) {
        return res.status(422).json({ success: false, msg: "Invalid token." });
    }
};