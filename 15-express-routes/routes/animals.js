import express from 'express';

const router = express.Router();

router.get('/dog', (req, res) => {
    res.status(200).send({ grow: 'guau guau' });
});

router.get('/cat', (req, res) => {
    res.status(200).send({ grow: 'miau' });
});

router.get('/bird', (req, res) => {
    res.status(200).send({ grow: 'pio pio' });
});

router.use((req, res) => {
    res.status(404).send({
        code: 404,
        error: 'Not Found',
        message: 'Error: Path not found',
    });
});

export default router;
