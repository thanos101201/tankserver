const teamModel = require("../../model/team");

const getTeam = (req, res) =>{
    const id = req.headers.id
    teamModel.find({
        _id: id
    }).then((resp1) => {
        if(resp1.length === 0){
            res.status(204).send()
        }
        else{
            res.status(200).send({
                'message': 'Team data is here',
                'data': resp1
            });
        }
    }).catch((er1) => {
        res.status(400).send(er1);
    });
}

module.exports = getTeam;