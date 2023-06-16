const express = require('express');
const multer = require('multer');
const app = express();

// configure multer middleware to store uploaded files in the 'uploads' folder
const upload = multer({ dest: 'uploads/' });

// define the image upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  const imageUrl = `http://localhost:3000/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
