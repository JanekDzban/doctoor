const Alexa = require('ask-sdk-core');

const MedicinesInfoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MedicinesInfoIntent';
    },
    handle(handlerInput) {
        const drugName = handlerInput.requestEnvelope.request.intent.slots.medicineName.value;
        
       	var myParams = { Bucket: '8e93a926-0a2a-4fdf-b1db-fd216179d85a-eu-west-1', Key: 'Media/Doctoor.MedicinesInfo/RPL.csv' };
    	var AWS = require('aws-sdk'); var s3 = new AWS.S3();
        
        return handlerInput.responseBuilder
            .speak(drugName)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

module.exports = MedicinesInfoIntentHandler;