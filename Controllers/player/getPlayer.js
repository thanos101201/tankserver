const playerModel = require("../../model/player")

const getPlayer = (req, res) => {
    const email = req.headers.email;
    playerModel.find({
        email: email
    }).then((resp1) => {
        if(resp1.length === 0){
            res.status(204).send();
        }
        else{
            res.status(200).send({
                'message': 'Player data is here',
                'data': resp1
            });
        }
    }).catch((er1) => {
        res.status(400).send(er1);
    });
}

module.exports = getPlayer;