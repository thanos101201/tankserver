const playerModel = require("../../model/player");
const teamModel = require("../../model/team");

const joinTeam = (req, res) => {
    const email = req.body.email;
    const id = req.body.id;

    playerModel.find({
        email: email
    }).then((resp1) => {
        if(resp1.length === 0){
            res.status(403).send({
                'message': 'Email not registered'
            });
        }
        else{
            teamModel.find({
                _id: id
            }).then((resp2) => {

                if(resp2.length === 0){
                    res.status(403).send({
                        'message': 'Team not regisetere'
                    });
                }
                else{
                    let ply = resp2[0].players;
                    if(ply.indexOf(email) === -1){
                        ply.push(email);
                    }
                    teamModel.updateOne({
                        _id: id
                    }, {
                        players: ply
                    }).then((resp3) =>{
                        res.status(200).send({
                            'message': 'Joined team'
                        });
                    }).catch((er3) => {
                        res.status(400).send(er3);
                    })
                }
            }).catch((er2) => {
                res.status(400).send(er2);
            })
        }
    }).catch((er1) => {
        res.status(400).send(er1);
    })
}

module.exports = joinTeam;