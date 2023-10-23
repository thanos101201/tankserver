const playerModel = require("../../model/player");
const teamModel = require("../../model/team");

const addTeam = (req, res) => {
    let teamm = new teamModel();
    let email = req.body.email;
    let ply = [email];
    teamModel.find().then((resp10) => {
        if(resp10.length === 0){
            teamm.players = ply;
            teamm.save().then((resp1) => {
                if(resp1._id !== undefined){
                    playerModel.updateOne({
                        email: email
                    }, {
                        teamId: resp1._id
                    }).then((resp2) => {
                        res.status(200).send({
                            'message': 'Team added'
                        });
                    }).catch((er2) => {
                        res.status(400).send(er2);
                    })
                }
            }).catch((er1) => {
                res.status(400).send(er1);
            });
        }
        else{
            let ar = resp10.filter((e) => {
                if(e.players.indexOf(email) !== -1){
                    return true;
                }
                return false;
            });

            if(ar.length === 0){
                teamm.players = ply;
                teamm.save().then((resp1) => {
                    if(resp1._id !== undefined){
                        playerModel.updateOne({
                            email: email
                        }, {
                            teamId: resp1._id
                        }).then((resp2) => {
                            res.status(200).send({
                                'message': 'Team added'
                            });
                        }).catch((er2) => {
                            res.status(400).send(er2);
                        })
                    }
                }).catch((er1) => {
                    res.status(400).send(er1);
                });
            }
            else{
                res.status(400).send({
                    'message': 'User has already joined a team'
                })
            }
        }
    }).catch((er10) => {
        res.status(400).send(er10);
    })
}

module.exports = addTeam;