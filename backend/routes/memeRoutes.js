const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  uploadMeme,
  getAllMemes,
  getMemeById,
  deleteMeme,
  downloadMeme
} = require('../controllers/memeController');

router.get('/', getAllMemes);
router.get('/:id', getMemeById);
router.post('/upload', upload.single('image'), uploadMeme);
router.get('/:id/download', downloadMeme);
router.delete('/:id', deleteMeme);

module.exports = router;