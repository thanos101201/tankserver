const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    name: {
        type: String
    },
    players: {
        type: Array
    }
});


const teamModel = mongoose.model('Team', teamSchema);

module.exports = teamModel;