const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Lista de usuarios');
});

router.get('/:id', (req, res) => {
    res.send(`ID: ${req.params.id}`);
});

module.exports = router;
