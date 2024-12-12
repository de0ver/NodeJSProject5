module.exports = function(req, res, next) {
    res.locals.csrf = req.csrfToken();
    res.locals.isAuth = req.session.isAuthenticated;
    next();
}