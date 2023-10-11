const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/where2meet', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const Location = require('./models/location');

app.get('/', (req, res) => {
    res.render('home');
})

app.post('/api/locations', (req, res) => {
    const location = new Location(req.body);
    location.save()
        .then(result => res.json(result))
        .catch(error => res.status(500).json(error));
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
