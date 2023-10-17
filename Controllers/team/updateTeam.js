const axios = require('axios');
const teamModel = require('../../model/team');


const updateTeam = (req, res) => {
    const name = req.body.name;
    const id = req.body.id;
    teamModel.updateOne({
        _id: id
    }, {
        name: name
    }).then((resp1) => {
        res.status(200).send({
            'message': 'Name updated'
        });
    }).catch((er1) => {
        res.status(400).send(er1);
    });
}

module.exports = updateTeam;