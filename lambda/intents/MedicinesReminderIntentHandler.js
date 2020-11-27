const Alexa = require('ask-sdk-core');

const MedicinesReminderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MedicinesReminderIntent';
    },
    handle(handlerInput) {
        const reminderApiClient = handlerInput.serviceClientFactory.getReminderManagementServiceClient(),
            {permisions} = handlerInput.requestEnvelope.context.System.user;
        if(!permisions) {
            return handlerInput.responseBuilder
                .speak("Please go to the Alexa mobile app to grant reminders permissions.")
                .withAskForPermissionsConsentCard(['alexa::alerts:reminders:skill:readwrite'])
                .getResponse();
        }
        const speakOutput = 'MedicinesReminderIntentHandler';
        console.log('MedicinesRemindnerIntentHandler');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

module.exports = MedicinesReminderIntentHandler;
