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

  function defaultWelcomeIntent(agent) {
    agent.requestSource = "ACTIONS_ON_GOOGLE";
    let conv = agent.conv();
    conv.ask('Hi! I am bot and I am virtual assistant of Win Supply. Plase choose an option');
    conv.ask(new Suggestions(['View Products', 'Vendor Relations']));
    agent.add(conv);
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

  async function browseCarousel(agent, product_name, color, company) {

    agent.requestSource = "ACTIONS_ON_GOOGLE";
    let res = await axios.get(`http://54.84.123.253:8983/solr/winsupply/select?q=%22${product_name}%22AND(%22${color}%22OR%22${product_name}%22)`);
    const result = res.data.response.docs;

    console.log(color + ' ' + company);
    console.log(result[0].product_name);

    let conv = agent.conv();
    conv.ask(`Here are the ${product_name} of ${color} color and ${company} manufacturer`);

    conv.ask(new BrowseCarousel({
      items: [
        new BrowseCarouselItem({
          title: result[0].product_name,
          url: result[0].url_link,
          image: new Image({
            url: result[0].image_link,
            alt: result[0].product_name,
          }),

        }),
        new BrowseCarouselItem({
          title: result[1].product_name,
          url: result[1].url_link,
          image: new Image({
            url: result[1].image_link,
            alt: result[1].product_name,
          }),
        }),
      ],
    }));
    agent.add(conv);
  }

  async function bathroomfaucet_color_manufacturer(agent) {

    const color = agent.context.get('bathroomfaucet-color-followup').parameters.color;
    const company = agent.parameters.manufacturer;
    const product_name = 'bathroom faucets';

    await browseCarousel(agent, product_name, color, company);
  }

  async function bathroomsink_color_manufacturer(agent) {

    const color = agent.context.get('bathroomsink-color-followup').parameters.color;
    const company = agent.parameters.manufacturer;
    const product_name = 'bathroom sinks';

    await browseCarousel(agent, product_name, color, company);
  }

  async function kitchenfaucet_color_manufacturer(agent) {

    const color = agent.context.get('kitchenfaucet-color-followup').parameters.color;
    const company = agent.parameters.manufacturer;
    const product_name = 'kitchen faucets';

    await browseCarousel(agent, product_name, color, company);
  }
  async function kitchensink_color_manufacturer(agent) {

    const color = agent.context.get('kitchensink-color-followup').parameters.color;
    const company = agent.parameters.manufacturer;
    const product_name = 'kitchen sinks';

    await browseCarousel(agent, product_name, color, company);
  }
  async function kitchenwaterdispenser_color_manufacturer(agent) {

    const color = agent.context.get('kitchenwaterdispenser-color-followup').parameters.color;
    const company = agent.parameters.manufacturer;
    const product_name = 'kitchen water dispensers';

    await browseCarousel(agent, product_name, color, company);
  }
  async function showerandtubfaucet_color_manufacturer(agent) {

    const color = agent.context.get('showerandtubfaucet-color-followup').parameters.color;
    const company = agent.parameters.manufacturer;
    const product_name = 'shower and tub faucets';

    await browseCarousel(agent, product_name, color, company);
  }
  async function waterfiltration_color_manufacturer(agent) {

    const color = agent.context.get('waterfiltration-color-followup').parameters.color;
    const company = agent.parameters.manufacturer;
    const product_name = 'water filtration';

    await browseCarousel(agent, product_name, color, company);
  }
  async function watersoftening_color_manufacturer(agent) {

    const color = agent.context.get('watersoftening-color-followup').parameters.color;
    const company = agent.parameters.manufacturer;
    const product_name = 'water softening';

    await browseCarousel(agent, product_name, color, company);
  }


  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', defaultWelcomeIntent);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('BathroomFaucet-color-manufacturer', bathroomfaucet_color_manufacturer);
  intentMap.set('BathroomSink-color-manufacturer', bathroomsink_color_manufacturer);
  intentMap.set('KitchenFaucet-color-manufacturer', kitchenfaucet_color_manufacturer);
  intentMap.set('KitchenSink-color-manufacturer', kitchensink_color_manufacturer);
  intentMap.set('KitchenWaterDispenser-color-manufacturer', kitchenwaterdispenser_color_manufacturer);
  intentMap.set('ShowerAndTubFaucet-color-manufacturer', showerandtubfaucet_color_manufacturer);
  intentMap.set('WaterFiltration-color-manufacturer', waterfiltration_color_manufacturer);
  intentMap.set('WaterSoftening-color-manufacturer', watersoftening_color_manufacturer);

  agent.handleRequest(intentMap);
});
