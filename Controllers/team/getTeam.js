const playerModel = require("../../model/player");
const teamModel = require("../../model/team");

const getTeam = (req, res) =>{
    const id = req.headers.id
    teamModel.find({
        _id: id
    }).then(async (resp1) => {
        if(resp1.length === 0){
            res.status(204).send()
        }
        else{
            await playerModel.find({
                email: {
                    $in : resp1[0].players
                }
            }).then((resp2) => {
                res.status(200).send({
                    'message': 'Team data is here',
                    'data': resp2
                });
            }).catch((er2) => {
                res.status(400).send(er2);
            })
        }
    }).catch((er1) => {
        res.status(400).send(er1);
    });
}

module.exports = getTeam;