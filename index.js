const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/event/:eventID', (req, res) => {
    const eventID = req.params.eventID;
    Location.findOne({ eventID: eventID })
        .then(event => {
            res.render('eventPage.ejs', { event });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Server Error');
        });
});

app.get('/api/locations/:eventID', (req, res) => {
    const { eventID } = req.params;

    Location.find({ eventID: eventID })
        .then(locations => {
            res.json(locations);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});

app.get('/', (req, res) => {
    res.render('home');
})

app.post('/createEvent', (req, res) => {
    const { event_name } = req.body;
    const newEvent = new Location({
        eventID: uuidv4(),
        event_name
    });

    newEvent.save()
        .then(() => {
            console.log('Saved to database');
            res.redirect(`/event/${newEvent.eventID}`);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Server Error');
        });
});


app.post('/api/locations', (req, res) => {
    const location = new Location(req.body);
    location.save()
        .then(result => res.json(result))
        .catch(error => res.status(500).json(error));
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
