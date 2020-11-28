const Alexa = require('ask-sdk-core');

const MedicineInfoDB = JSON.parse(
    '{"apap":{"description":"Nice apap drug!"}}'
);

const MedicinesInfoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MedicinesInfoIntent';
    },
    handle(handlerInput) {
        const drugName = handlerInput.requestEnvelope.request.intent.slots.medicineName.value;
        
        return handlerInput.responseBuilder
            .speak(MedicineInfoDB[drugName].description)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

module.exports = MedicinesInfoIntentHandler;