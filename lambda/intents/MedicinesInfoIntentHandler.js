const Alexa = require('ask-sdk-core');

const MedicinesInfoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MedicinesInfoIntent';
    },
    handle(handlerInput) {
        const drugName = handlerInput.requestEnvelope.request.intent.slots.medicineName.value;
        var fs = require('fs');
        var data = JSON.parse(fs.readFileSync('./intents/data.json', 'utf8'));
        
        console.log('data read');
        console.log(data);
        console.log(data['xanax']);
        
        return handlerInput.responseBuilder
            .speak(data['xanax'].description)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

module.exports = MedicinesInfoIntentHandler;