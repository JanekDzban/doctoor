const Alexa = require('ask-sdk-core');

const MedicinesReminderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MedicinesReminderIntent';
    },
    async handle(handlerInput) {
        const speakOut = 'Tada!';
        return handlerInput.responseBuilder
            .speak(speakOut)
            .reprompt(speakOut)
            .getResponse();
    }
};

module.exports = MedicinesReminderIntentHandler;