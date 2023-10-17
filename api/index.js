const express = require('express');

const app = express();
const cors = require('cors');

app.use(cors({
    origin: '*',
    methods: [
        'GET',
        'PUT',
        'POST',
        'DELETE'
    ]
}));

const login = require('../Controllers/player/login');
require('../db/db');
const player = require('../router/player');
const team = require('../router/team');
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Welcome');
});
app.get('/log', (req, res) => {
    login(req, res);
})
app.use('/player', (req, res) => {
    player(req, res);
});

app.use('/team', (req, res) => {
    team(req, res);
})
app.listen(3001, () => {
    console.log('Server started');
});