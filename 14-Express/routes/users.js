const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Lista de usuarios');
});

router.get('/:id', (req, res) => {
    res.send(`ID: ${req.params.id}`);
});

router.post('/', (req, res) => {
    res.send('Got a POST request at /users');
});

router.put('/:id', (req, res) => {
    res.send(`Got a PUT request at /users/${req.params.id}`);
});

router.delete('/:id', (req, res) => {
    res.send(`Got a DELETE request at /users/${req.params.id}`);
});

module.exports = router;
