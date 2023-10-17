const teamModel = require("../../model/team");

const addTeam = (req, res) => {
    let teamm = new teamModel();
    let email = req.body.email;
    let ply = [email];

    teamm.players = ply;
    teamm.save().then((resp1) => {
        res.status(200).send({
            'message': 'Team added'
        });
    }).catch((er1) => {
        res.status(400).send(er1);
    });
}

module.exports = addTeam;