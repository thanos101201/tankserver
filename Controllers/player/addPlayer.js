const axios = require('axios');

const getToken = async (code) => {
    return await axios.post('https://oauth2.googleapis.com/token', {
        code: code,
        client_id: "611658826728-gp7el8t7t63g46o807c6unjd99tfg4lm.apps.googleusercontent.com",
        client_secret: "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",
        redirect_uri: "http://localhost:3000/sign",
        grant_type: "authorization_code"  
    })
}

const fetchStreamIdStore = async (config) => {
    return await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources',config)
}

const getUserDetail = async (config) => {
    return await axios.get('https://openidconnect.googleapis.com/v1/userinfo', config)
}

const obtainStepId = () => {
    let step_id = "";
    if(resp3.data.dataSource !== undefined && resp3.data.dataSource.length > 0){
        resp3.data.dataSource.map((e1,k1) => {
            if(e1.dataStreamName === "merge_step_count_delta"){
                cal_id = e1.dataStreamId;
            }
        });
    }
    return step_id;
}

const obtainMintId = (resp3) => {
    let min_id = "";
    if(resp3.data.dataSource !== undefined && resp3.data.dataSource.length > 0){
        resp3.data.dataSource.map((e1,k1) => {
            if(e1.dataStreamName === "merge_heart_minutes"){
                min_id = e1.dataStreamId;
            }
        });
    }
    //returning the minutes id
    return min_id;
}

const addPlayer = async (req, res) => {
    const code = req.headers.code;
    console.log(` code :- ${code}`);
    try{
        var token = await getToken(code);
        if(token.data !== undefined && token.data.access_token !== undefined){
            try{
                let config = {
                    headers: {
                        'Authorization': 'Bearer ' + token.data.access_token
                    }
                }
                let userDetail = await getUserDetail(config);
                if(userDetail.data !== undefined && userDetail.data.email !== undefined){
                    let email = userDetail.data.email;
                    let name = userDetail.data.name;
                    try{
                        let streamStore = await fetchStreamIdStore(config);
                        let mintId = obtainMintId(streamStore);
                        let stepId = obtainStepId(streamStore);
                        
                        res.status(200).send(mintId);

                    }catch(er3){
                        res.status(403).send(er3);
                        return;
                    }
                }
            }catch(er2){
                res.status(403).send(er2);
                return;
            }
        }
        else{
            res.status(403).send({
                'message': 'Please retry login'
            });
        }
    }catch(e1){
        res.status(400).send(e1);
    }
}

module.exports = addPlayer;