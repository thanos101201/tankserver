const axios = require('axios');
const playerModel = require('../../model/player');
const { google } = require('googleapis');
const getToken = async (code) => {
    return await axios.post('https://oauth2.googleapis.com/token', {
        code: code,
        client_id: "611658826728-9b0ii06remopbv84a4tshv5j76ksostr.apps.googleusercontent.com",
        client_secret: "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",
        redirect_uri: "https://tankclient.vercel.app/sign",
        grant_type: "authorization_code"  
    })
}
const getUser = async (email) => {
    return await playerModel.find({
        email: email
    })
}
const fetchStreamIdStore = async (config) => {
    return await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources',config)
}

const getUserDetail = async (config) => {
    return await axios.get('https://openidconnect.googleapis.com/v1/userinfo', config)
}

const obtainStepId = (resp3) => {
    let step_id = "";
    if(resp3.data.dataSource !== undefined && resp3.data.dataSource.length > 0){
        // console.log(resp3.data.dataSource);
        resp3.data.dataSource.map((e1,k1) => {
            if(e1.dataStreamName === "merge_step_deltas"){
                step_id = e1.dataStreamId;
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

const obtainCalId  = (resp3) => {
    let cal_id = "";
    if(resp3.data.dataSource !== undefined && resp3.data.dataSource.length > 0){
        resp3.data.dataSource.map((e1,k1) => {
            if(e1.dataStreamName === "merge_calories_expended"){
                cal_id = e1.dataStreamId;
            }
        });
    }
    //returning the calorie id
    return cal_id;
}

const getMintDt = async (streamId, config) => {
    const fitness = google.fitness('v1');// creating the fitness client object
    const startDate1 = new Date();
    startDate1.setDate((new Date().getDate()) - 1);
    console.log(` startdate :- ${startDate1}`);
    // startDate1.setMonth(startDate1.getMonth() -1); // Subtract one month from current date
    const startTimeMillis = startDate1.getTime(); // Get start time in milliseconds
    const endTimeMillis = new Date();
    console.log(`endtime : -${endTimeMillis}`);
    return await axios.post("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
        aggregateBy: [
        {
            dataTypeName: 'com.google.heart_minutes',
            dataSourceId: streamId // 'derived:com.google.heart_minutes:com.google.android.gms:merge_heart_minutes',
        },
        ],
        bucketByTime: {
        durationMillis: 86400000, // 24 hours in milliseconds
        },
        startTimeMillis: startTimeMillis, // Replace with your desired start time
        endTimeMillis: endTimeMillis.getTime(), // Replace with your desired end time
    }, config)
}

const getCalorieData = async (config, calId) => {
    const startDate1 = new Date();
    startDate1.setDate((new Date().getDate()) - 1);
    // startDate1.setMonth(startDate1.getMonth() -1); // Subtract one month from current date
    const startTimeMillis = startDate1.getTime(); // Get start time in milliseconds
    const endTimeMillis = Date.now();
    return await axios.post("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
        aggregateBy: [
            {
                dataTypeName: 'com.google.calories.expended', //'merge_calories_expended',// 'com.google.heart_minutes',
                dataSourceId: calId //'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended' //'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended'// resp1[0].streamId // 'derived:com.google.heart_minutes:com.google.android.gms:merge_heart_minutes',
            },
        ],
        bucketByTime: {
        durationMillis: 86400000, // 24 hours in milliseconds
        },
        startTimeMillis: startTimeMillis, // Replace with your desired start time
        endTimeMillis: endTimeMillis, // Replace with your desired end time
    }, config)
}

const getStepData = async (config, stepId) => {
    const startDate1 = new Date();
    startDate1.setDate((new Date().getDate()) - 1);
    // startDate1.setMonth(startDate1.getMonth() -1); // Subtract one month from current date
    const startTimeMillis = startDate1.getTime(); // Get start time in milliseconds
    const endTimeMillis = Date.now();
    return await axios.post("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
        aggregateBy: [
            {
                dataTypeName: 'com.google.step_count.delta', //'merge_calories_expended',// 'com.google.heart_minutes',
                dataSourceId: stepId //'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended' //'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended'// resp1[0].streamId // 'derived:com.google.heart_minutes:com.google.android.gms:merge_heart_minutes',
            },
        ],
        bucketByTime: {
        durationMillis: 86400000, // 24 hours in milliseconds
        },
        startTimeMillis: startTimeMillis, // Replace with your desired start time
        endTimeMillis: endTimeMillis, // Replace with your desired end time
    }, config)
}


const calculateMintData = (resp3) => {
    let mints = 0;
    if(resp3.data.bucket.length > 0){
        resp3.data.bucket.map((e2,k2) => {
            if(e2.dataset.length > 0){
                // console.log("Hello Namaste :- ")
                e2.dataset.map((e3, k3) => {
                    // console.log("Namo :- "+e3.point.length);
                    if(e3.point.length > 0){
                        e3.point.map((e4, k4) => {
                            // console.log("Namaste :- "+e4.value[0].fpVal);
                            mints = mints + e4.value[0].fpVal;
                        });
                    }
                })
            }
        });
    }
    console.log("Minutes data :- "+mints);
    return mints;
}

const calculateCalorie = (resp5) => {
    let cals = 0;
    if(resp5.data.bucket.length > 0){
        // console.log('Namaste :- ');
        resp5.data.bucket.map((e2,k2) => {
            // console.log('Hello :- ');
            if(e2.dataset.length > 0){
                e2.dataset.map((e3, k3) => {
                    // console.log('Hi :- '+cals);
                    if(e3.point.length > 0){
                        e3.point.map((e4, k4) => {
                            // console.log(`type is : ${Object.keys(e4.value)}`);
                            cals = cals + e4.value[0].fpVal;
                        });
                    }
                })
            }
        });
    }
    return cals;
}

const calculateStep = (resp5) => {
    let steps = 0;
    if(resp5.data.bucket.length > 0){
        // console.log('Namaste :- ');
        resp5.data.bucket.map((e2,k2) => {
            // console.log('Hello :- ');
            if(e2.dataset.length > 0){
                // console.log(`WEll here it is`);
                e2.dataset.map((e3, k3) => {
                    console.log('Hi :- '+steps);
                    if(e3.point.length > 0){
                        e3.point.map((e4, k4) => {
                            // console.log(`type is : ${Object.keys(e4.value[0])}`);
                            steps = steps + e4.value[0].intVal;
                        });
                    }
                })
            }
        });
    }
    return steps;
}

const addUser = (name,email,stepId,calId,mintId,steps,calorie,minutes) => {
    let playerm = new playerModel();
    playerm.name = name;
    playerm.email = email;
    playerm.stepId = stepId;
    playerm.calId = calId;
    playerm.mintId = mintId;
    playerm.steps = steps;
    playerm.calorie = calorie;
    playerm.minutes = minutes;

    return playerm.save();
}
const updateUser = async(email,steps,calories,minutes) =>{
    return await playerModel.updateOne({
        email: email
    }, {
        steps: steps,
        minutes: minutes,
        calorie: calories
    })
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
                    console.log(`${email} : ${name}`);
                    try{
                        let userdata = await getUser(email);
                        if(userdata.length === 0){
                            console.log(`User data length is ${userdata.length}`);
                            let streamStore = await fetchStreamIdStore(config);
                            let mintId = obtainMintId(streamStore);
                            let stepId = obtainStepId(streamStore);
                            // console.log(`length of streamstore is ${stepId}`);
                            let calId = obtainCalId(streamStore);
                            console.log(`${mintId} : ${stepId} : ${calId}`);
                            if(mintId !== ""){
                                try{
                                    let minuteData = await getMintDt( mintId, config);
                                    console.log(`step data is ${minuteData}`);
                                    let calData = await getCalorieData(config, calId);
                                    let stepData = await getStepData(config, stepId);
                                    if(stepData.data !== undefined){
                                        let minute = calculateMintData(minuteData);
                                        let calorie = calculateCalorie(calData);
                                        let step = calculateStep(stepData);
                                        try{
                                            let steps = {
                                                [`${new Date().getDate()} : ${new Date().getMonth()} : ${new Date().getFullYear()}`] : step
                                            }
                                            let calories = {
                                                [`${new Date().getDate()} : ${new Date().getMonth()} : ${new Date().getFullYear()}`] : calorie
                                            }
                                            let minutes = {
                                                [`${new Date().getDate()} : ${new Date().getMonth()} : ${new Date().getFullYear()}`] : minute
                                            }
                                            let added = await addUser(name,email,stepId,calId,mintId,steps,calories,minutes)
                                            res.status(200).send({
                                                'message': 'User added',
                                                'data': 'Data is here',
                                                'email' : email
                                            });
                                            return;
                                        }
                                        catch(er5){
                                            res.status(400).send(er5);
                                            return;
                                        }
                                    }
                                    else{
                                        res.status(400).send({
                                            'message': 'Data not obtained'
                                        });
                                        return;
                                    }
                                }catch(er4){
                                    res.status(400).send(er4);
                                    return;
                                }
                            }
                            else{
                                res.status(403).send({
                                    'message': 'Install google fit application'
                                });
                                return;
                            }
                        }
                        else{
                            console.log(`User present`);
                            console.log(`${typeof(userdata)}`);
                            let mintId = userdata.mintId;
                            let stepId = userdata.stepId;
                            let calId = userdata.calId;
                            if(mintId !== ""){
                                try{
                                    let minuteData = await getMintDt( mintId, config);
                                    let calData = await getCalorieData(config, calId);
                                    let stepData = await getStepData(config, stepId);
                                    console.log(`Cal data : ${calData} : minute data : ${minuteData} : stepData : ${stepData}`);
                                    if(stepData.data !== undefined){
                                        let minute = calculateMintData(minuteData);
                                        let calorie = calculateCalorie(calData);
                                        let step = calculateStep(stepData);
                                        try{
                                            let steps = userdata[0].steps;
                                            console.log(`Data is here : ${Object.keys(steps)}`);
                                            steps[`${new Date().getDate()} : ${new Date().getMonth()} : ${new Date().getFullYear()}`] = step
                                            let calories = userdata[0].calorie;
                                            calories[`${new Date().getDate()} : ${new Date().getMonth()} : ${new Date().getFullYear()}`] = calorie
                                            let minutes = userdata[0].minutes;
                                            minutes[`${new Date().getDate()} : ${new Date().getMonth()} : ${new Date().getFullYear()}`] = minute
                                            let updated = await updateUser(email,steps,calories,minutes)
                                            res.status(200).send({
                                                'message': 'Data updated',
                                                'data': 'Data is here',
                                                'email' : email
                                            });
                                            return;
                                        }
                                        catch(er5){
                                            res.status(400).send(er5);
                                            return;
                                        }
                                    }
                                    else{
                                        res.status(400).send({
                                            'message': 'Data not obtained'
                                        });
                                        return;
                                    }
                                }catch(er4){
                                    res.status(400).send(er4);
                                    return;
                                }
                            }
                            else{
                                res.status(403).send({
                                    'message': 'Install google fit application'
                                });
                                return;
                            }
                        }
                        
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