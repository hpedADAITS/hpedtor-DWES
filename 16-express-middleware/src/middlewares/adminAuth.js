const adminAuth = (req, res, next) => {
    const password = req.headers.password;

    if (!password || password !== 'patata') {
        const error = new Error(
            "Acceso restringido, por favor, incluya la palabra secreta en el parámetro 'password' en la cabera de la petición",
        );
        error.statusCode = 401;
        return next(error);
    }

    next();
};

module.exports = adminAuth;
