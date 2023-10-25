const teamModel = require('../../model/team');
const playerModel = require('../../model/player');


const updateTeam = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    playerModel.find({
        email: email
    }).then((resp1) => {
        console.log(resp1);
        if(resp1.length === 0){
            res.status(204).send();
        }
        else{
            teamModel.updateOne({
                _id: resp1[0].teamId
            }, {
                name: name
            }).then((resp2) => {
                console.log(resp2);
                res.status(200).send({
                    'message': 'Team Name updated'
                });
            }).catch((er2) => {
                res.status(400).send(er2);
            })
        }
    }).catch((er1) => {
        res.status(400).send(er1);
    })
    // teamModel.updateOne({
    //     _id: id
    // }, {
    //     name: name
    // }).then((resp1) => {
    //     res.status(200).send({
    //         'message': 'Name updated'
    //     });
    // }).catch((er1) => {
    //     res.status(400).send(er1);
    // });
}

module.exports = updateTeam;