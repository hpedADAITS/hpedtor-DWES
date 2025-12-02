async function getUsers(req, res, next) {
    const filters = req.query;
    return res.status(200).json({ results: [], filters });
}

function getUserId(req, res, next) {
    return res.status(200).json({ id: req.params.id });
}

function createUser(req, res, next) {
    return res.status(201).json({ message: 'Created', user: req.body });
}

module.exports = {
    getUsers,
    getUserId,
    createUser,
};
