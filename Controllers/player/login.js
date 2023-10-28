const { google } = require('googleapis');
const login = (req, res) => {
    // const email = req.body.email;
    // console.log(email);
    // const state = { em : email};
    const oauth2Client = new google.auth.OAuth2(
        "611658826728-9b0ii06remopbv84a4tshv5j76ksostr.apps.googleusercontent.com",
        "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",
        "https://tankclient.vercel.app/sign"
        );
        
    const scopes = ["https://www.googleapis.com/auth/fitness.activity.read profile email openid"]
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
    })
    // res.send("Hiiii");
    // res.send(req.body.callbackURL);

    res.send({url});
    // request(url, (err, response, body) => {
    //     console.log("error ", err);
    //     console.log("statusCode: ", response && response.statusCode);
    //     res.send({url});
    //     const queryURL = new urlParse(url);
    //     const code = queryPArse.parse(queryURL.query).client_id;
    //     console.log(code);
    // })
}

module.exports = login;