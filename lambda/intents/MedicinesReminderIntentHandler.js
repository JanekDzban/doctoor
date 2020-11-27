const Alexa = require('ask-sdk-core');

const MedicinesReminderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MedicinesReminderIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'MedicinesReminderIntentHandler';
        console.log('MedicinesRemindnerIntentHandler');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

module.exports = MedicinesReminderIntentHandler;
