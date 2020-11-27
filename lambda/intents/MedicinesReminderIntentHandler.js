const Alexa = require('ask-sdk-core');

const MedicinesRemidnerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MedicinesRemidnerIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'MedicinesRemidnerIntentHandler';
        console.log('MedicinesRemidnerIntentHandler');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

module.exports.MedicinesRemidnerIntentHandler = function get () {
    return MedicinesRemidnerIntentHandler;
}
