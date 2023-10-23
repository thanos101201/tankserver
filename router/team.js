const express = require('express');
const joinTeam = require('../Controllers/team/joinTeam');
const updateTeam = require('../Controllers/team/updateTeam');
const addTeam = require('../Controllers/team/addTeam');
const getTeam = require('../Controllers/team/getTeam');

const router = express.Router();

router.get('/', (req, res) => {
    getTeam(req, res);
});

router.post('/', (req, res) => {
    addTeam(req, res);
});

router.put('/join', (req, res) => {
    joinTeam(req, res);
});

router.put('/name', (req, res) => {
    updateTeam(req, res);
})

module.exports = router;