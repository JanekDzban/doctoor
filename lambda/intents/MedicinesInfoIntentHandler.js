//'use strict';
const Alexa = require('ask-sdk-core');
    
//var csvdb = require("node-csv-query");
//var databaseConnection = null;

const MedicinesInfoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MedicinesInfoIntent';
    },
    handle(handlerInput) {
        
        return handlerInput.responseBuilder
            var drugName = handlerInput.requestEnvelope.request.intent.slots.medicineName.value;
        
            .speak(drugName)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

module.exports = MedicinesInfoIntentHandler;