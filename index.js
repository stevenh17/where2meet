const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/where2meet', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.get('/', (req, res) => {
    res.render('home');
})

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
