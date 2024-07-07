const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { initializeDatabase } = require('./models');
const { Meme, sequelize, Op } = require('./models');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const e = require('express');



const app = express();
const PORT = process.env.PORT || 3001;
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(cors());
app.use(bodyParser.json());


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// GET /memes
app.get('/memes', async (req, res) => {
    try {
      const { search } = req.query;
      console.log('Received search request:', search);
  
      let whereCondition = {};
      if (search) {
        whereCondition = {
          [Op.or]: [
            { description: { [Op.iLike]: `%${search}%` } },
            { extracted_text: { [Op.iLike]: `%${search}%` } },
          ]
        };
      }
  
      const memes = await Meme.findAll({
        where: whereCondition,
        limit: 20
      });
  
      console.log('Memes found:', memes.length);
      res.json(memes);
    } catch (error) {
      console.error('Error in /memes route:', error);
      res.status(500).json({ error: error.message });
    }
  });

// GET /memes/:id
app.get('/memes/:id', async (req, res) => {
  try {
    const meme = await Meme.findByPk(req.params.id);
    if (meme) {
      res.json(meme);
    } else {
      res.status(404).json({ error: 'Meme not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /memes (authenticated)
app.post('/memes', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const { description, extracted_text } = req.body;
      const imageUrl = `/uploads/${req.file.filename}`;
  
      const meme = await Meme.create({
        url: imageUrl,
        description,
        extracted_text
      });
  
      res.status(201).json(meme);
    } catch (error) {
      console.error('Error saving meme:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  
app.post('/generate-description', upload.single('image'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    try {
      const formData = new FormData();
      console.log('Uploaded file:', req.file);
      formData.append('image', fs.createReadStream(req.file.path), {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
  
      const response = await axios.post('http://localhost:8000/generate-description', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
  
      const description = response.data.description;
      const extracted_text = response.data.extracted_text;
      res.json({ description, extracted_text });
    } catch (error) {
      console.error('Error generating description:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      res.status(500).json({ error: 'Error generating description', details: error.message });
    }
  });



initializeDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1); // Exit the process if database initialization fails
  });