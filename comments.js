// Create web server 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const commentsPath = path.join(__dirname, 'comments.json');

app.use(bodyParser.json());

app.get('/comments', (req, res) => {
  fs.readFile(commentsPath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred');
      return;
    }

    res.json(JSON.parse(data));
  });
});

app.post('/comments', (req, res) => {
  const { author, text } = req.body;
  if (!author || !text) {
    res.status(400).send('Author and text are required');
    return;
  }

  fs.readFile(commentsPath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred');
      return;
    }

    const comments = JSON.parse(data);
    comments.push({ author, text });

    fs.writeFile(commentsPath, JSON.stringify(comments), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred');
        return;
      }

      res.send('Comment added');
    });
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});