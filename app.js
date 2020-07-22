const dialogflow = require('dialogflow');
const uuid = require('uuid'); //random unique identificaion number
const express =require('express');
const bodyParser = require('body-parser'); ///middleware for parsing post requests
const app= express();
const port = process.env.PORT || 5000;
const path = require('path');
const sessionId=uuid.v4();


//app.use(express.static("public"))


app.get('/chatbot/public/css/style.css' ,(req,res)=>{
  res.sendFile('/chatbot/public/css/style.css');
})
app.get('/chatbot/public/bot.png' ,(req,res)=>{
  res.sendFile('/chatbot/public/bot.png');
})
app.get('/chatbot/botui/js/index.js' ,(req,res)=>{
  res.sendFile('/chatbot/botui/js/index.js');
})

app.use(bodyParser.urlencoded({
extended:false  //req.body obj will contain string or array
}))

app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.post('/send-msg',(req,res)=>{
runSample(req.body.MSG).then(data=>{
  res.send({Reply:data})
})
})

/**
 * @param {string} projectId 
 */
async function runSample(msg,projectId = 'test-agent-nocirr') {
  const sessionId = uuid.v4();

  const sessionClient = new dialogflow.SessionsClient({
    keyFilename:"C:/chatbot/test-agent-10307ca3f713.json"
  });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: msg,
        languageCode: 'en-US',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
return result.fulfillmentText;

}

app.get('/',(req,res)=>{
  res.sendFile('/chatbot/botui/index.html');
})

app.post('/',(req,res)=>{
  runSample(req.body.MSG).then(data=>{
    res.send({Reply:data})
  })
  })
app.listen(port,()=>{
  console.log("running on port "+port);
})