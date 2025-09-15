export const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect("/");
};

export const requireGuest = (req, res, next) => {
    if (req.session && req.session.userId) {
        return res.redirect("/home");
    }
    next();
};