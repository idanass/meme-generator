const { v4: uuidv4 } = require('uuid');
const { minioClient, BUCKET_NAME } = require('../config/minio');
const { query } = require('../config/database');

const uploadMeme = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier envoyé' });
    }

    const { topText = '', bottomText = '' } = req.body;
    const file = req.file;

    const extension = file.originalname.split('.').pop();
    const objectName = `memes/${uuidv4()}-${Date.now()}.${extension}`;

    await minioClient.putObject(
      BUCKET_NAME,
      objectName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );

    const url = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${objectName}`;

    const result = await query(
      `INSERT INTO memes (filename, object_name, url, top_text, bottom_text)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [file.originalname, objectName, url, topText, bottomText]
    );

    res.status(201).json({ message: 'Mème uploadé !', meme: result.rows[0] });

  } catch (error) {
    console.error('Erreur upload:', error);
    res.status(500).json({ error: 'Erreur lors du upload' });
  }
};

const getAllMemes = async (req, res) => {
  try {
    const result = await query('SELECT * FROM memes ORDER BY created_at DESC');
    res.json({ count: result.rows.length, memes: result.rows });
  } catch (error) {
    console.error('Erreur récupération:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
};

const getMemeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM memes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mème non trouvé' });
    }
    res.json({ meme: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
};

const deleteMeme = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM memes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mème non trouvé' });
    }
    const meme = result.rows[0];
    await minioClient.removeObject(BUCKET_NAME, meme.object_name);
    await query('DELETE FROM memes WHERE id = $1', [id]);
    res.json({ message: 'Mème supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

const downloadMeme = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM memes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mème non trouvé' });
    }
    const meme = result.rows[0];
    const downloadUrl = await minioClient.presignedGetObject(BUCKET_NAME, meme.object_name, 60);
    res.json({ downloadUrl });
  } catch (error) {
    console.error('Erreur téléchargement:', error);
    res.status(500).json({ error: 'Erreur génération lien' });
  }
};

module.exports = { uploadMeme, getAllMemes, getMemeById, deleteMeme, downloadMeme };