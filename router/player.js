const express = require('express');
const getPlayer = require('../Controllers/player/getPlayer');
const addPlayer = require('../Controllers/player/addPlayer');

const router = express.Router();

router.get('/', (req, res) => {
    getPlayer(req, res);
});

router.get('/ply', (req, res) => {
    addPlayer(req, res);
});

module.exports = router;