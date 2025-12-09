const fs = require('fs');
const path = require('path');

const NOTES_DIR = path.join(__dirname, '../notes');

if (!fs.existsSync(NOTES_DIR)) {
    fs.mkdirSync(NOTES_DIR, { recursive: true });
}

async function getNotes(req, res, next) {
    try {
        const files = fs.readdirSync(NOTES_DIR).filter(f => f.endsWith('.note'));
        return res.status(200).json({ notes: files });
    } catch (error) {
        return res.status(500).json({ error: 'error al leer notas' });
    }
}

async function getNote(req, res, next) {
    try {
        const { id } = req.params;
        const filePath = path.join(NOTES_DIR, `${id}.note`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'nota no encontrada' });
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        return res.status(200).json({ id, content });
    } catch (error) {
        return res.status(500).json({ error: 'error al leer nota' });
    }
}

async function createNote(req, res, next) {
    try {
        const { id, content } = req.body;

        if (!id || !content) {
            return res.status(400).json({ error: 'falta id o contenido' });
        }

        const filePath = path.join(NOTES_DIR, `${id}.note`);

        if (fs.existsSync(filePath)) {
            return res.status(409).json({ error: 'la nota ya existe' });
        }

        fs.writeFileSync(filePath, content, 'utf-8');
        return res.status(201).json({ message: 'nota creada', id });
    } catch (error) {
        return res.status(500).json({ error: 'error al crear nota' });
    }
}

async function updateNote(req, res, next) {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'falta contenido' });
        }

        const filePath = path.join(NOTES_DIR, `${id}.note`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'nota no encontrada' });
        }

        fs.writeFileSync(filePath, content, 'utf-8');
        return res.status(200).json({ message: 'nota actualizada', id });
    } catch (error) {
        return res.status(500).json({ error: 'error al actualizar nota' });
    }
}

async function deleteNote(req, res, next) {
    try {
        const { id } = req.params;
        const filePath = path.join(NOTES_DIR, `${id}.note`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'nota no encontrada' });
        }

        fs.unlinkSync(filePath);
        return res.status(200).json({ message: 'nota eliminada', id });
    } catch (error) {
        return res.status(500).json({ error: 'error al eliminar nota' });
    }
}

module.exports = {
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
};
