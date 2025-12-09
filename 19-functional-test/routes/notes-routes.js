const { Router } = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const {
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
} = require('../controllers/notes-controllers');

const router = Router();

router.use(authMiddleware);

router.get('/', getNotes);
router.get('/:id', getNote);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
