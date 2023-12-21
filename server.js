const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

app.use(cors());

const PORT = process.env.PORT || 3000;
const notesFilePath = path.join(__dirname, './db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Additional routes such as POST to /api/notes, GET from /api/notes, etc. go here
app.post('/api/notes', (req, res) => {
    fs.readFile(notesFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error reading notes file.');
      }
  
      const notes = JSON.parse(data);
      const newNote = { 
        id: Date.now(), 
        title: req.body.title,
        text: req.body.text
      };
  
      notes.push(newNote);
  
      fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error saving the note.');
        }
  
        res.status(201).json(newNote);
      });
    });
  });

app.get('/api/notes', (req, res) => {
    fs.readFile(notesFilePath, 'utf8', (err, data) => {
        if (err) {
        console.error(err);
        return res.status(500).send('Error reading notes file.');
        }
    res.json(JSON.parse(data));
    });
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(notesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading notes file.');
        }

        let notes = JSON.parse(data);
        const noteId = parseInt(req.params.id, 10);
        notes = notes.filter(note => note.id !== noteId);

        fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing notes file.');
            }

            res.status(200).send('Note deleted');
        });
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});