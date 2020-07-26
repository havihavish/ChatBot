// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const axios = require('axios');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {
  WebhookClient
} = require('dialogflow-fulfillment');
const {
  Card,
  Suggestion
} = require('dialogflow-fulfillment');
const {
  Suggestions
} = require('actions-on-google');
const {
  Carousel,
  Image
} = require('actions-on-google');
const {
  BrowseCarousel,
  BrowseCarouselItem
} = require('actions-on-google');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'ws://chatbot-gjcqxl.firebaseio.com/'

});

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({
    request,
    response
  });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function myCustomHandler(agent) {
    agent.add(`Hi! I am bot and I am virtual assistant of Win Supply. Plase choose an option`);
    agent.add(new Suggestion(`View Products`));
    agent.add(new Suggestion(`Vendor Relations`));
  }

  function suggestions(agent) {

    agent.requestSource = "ACTIONS_ON_GOOGLE";
    let conv = agent.conv();

    conv.ask('Hi! I am bot and I am virtual assistant of Win Supply. Please choose an option');
    conv.ask(new Suggestions(['View Products', 'Vendor Relations']));
    agent.add(conv);
  }

  async function apiHandler_chip(agent) {

    agent.requestSource = "ACTIONS_ON_GOOGLE";
    let conv = agent.conv();

    conv.ask('Hi! I am bot and I am virtual assistant of Win Supply. Please choose an option');

    let res = await axios.get(`http://54.84.123.253:8983/solr/winsupply/select?q=*:*`);
    const result = res.data.response.docs;
    console.log(result[0].color);

    conv.ask(new Suggestions(result[0].color));
    conv.ask(new Suggestions(result[1].color));
    conv.ask(new Suggestions(result[2].color));

    agent.add(conv);
  }

  function apiHandler(agent) {
    const text = agent.parameters.text;
    return axios.get(`https://api.datamuse.com/words?rel_rhy=${text}`)
      .then((result) => {
        result.data.slice(0, 3).map(wordObj => {
          agent.add(wordObj.word);
        });
      });
  }
  async function browseCarousel(agent) {

    agent.requestSource = "ACTIONS_ON_GOOGLE";

    let res = await axios.get(`http://54.84.123.253:8983/solr/winsupply/select?q=*:*`);
    const result = res.data.response.docs;

    let conv = agent.conv();
    conv.ask('This is a browse carousel example from fulfillment.');
    // Create a browse carousel
    conv.ask(new BrowseCarousel({
      items: [
        new BrowseCarouselItem({
          title: result[0].product_name,
          url: result[0].link[0],
          image: new Image({
            url: 'https://pimmedia.winsupplyinc.com/pim/L/112017/MOEN-FAUCETS_6410BN_12446410BN_L.jpg',
            alt: 'bathroom faucet',
          }),
          //Supported in next update
        }),
        new BrowseCarouselItem({
          title: result[1].product_name,
          url: result[1].link[0],
          image: new Image({
            url: 'https://pimmedia.winsupplyinc.com/pim/L/112017/MOEN-FAUCETS_6410BN_12446410BN_L.jpg',
            alt: 'bathroom faucet',
          }),
        }),
      ],
    }));
    agent.add(conv);
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', browseCarousel);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('apicalls', apiHandler);
  agent.handleRequest(intentMap);
});
