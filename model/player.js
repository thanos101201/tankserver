const mongoose = require('mongoose');

const playerSchema= mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    stepId: {
        type: String
    },
    calId: {
        type: String
    },
    mintId: {
        type: String
    },
    steps: {
        type: Object
    },
    calorie: {
        type: Object
    },
    minutes: {
        type: Object
    },
    teamId: {
        type: String
    }
});

const playerModel = mongoose.model('Player', playerSchema);

module.exports = playerModel;