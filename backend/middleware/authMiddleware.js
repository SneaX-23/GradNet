export const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.status(401).json({ success: false, message: "Authentication required" });
};

export const requireGuest = (req, res, next) => {
    if (req.session && req.session.userId) {
        return res.status(403).json({ success: false, message: "You are already logged in." });
    }
    next();
};

export const requireOnboarding = (req, res, next) => {
    if (req.session && req.session.email && !req.session.userId) {
        return next();
    }
    res.status(401).json({ message: 'Authorization required' });
};