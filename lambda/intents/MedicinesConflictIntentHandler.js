const Alexa = require('ask-sdk-core');
const https = require('https');

// How to test it?
// open doctoor
// what medicines should i not take with apap
//  expected result: I checked apap and found 2 conflicts that you <emphasis level="strong">should not</emphasis> take <break time="1s"/> Velosef Xanas
// what medicines should i not take with cox
//  expected result: I was not able to find any data.

const MedicinesConflictIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MedicinesConflictIntent';
    },
    async handle(handlerInput) {
        const reqEnv = handlerInput.requestEnvelope;
        const slots = reqEnv.request.intent.slots;
        const medicineName = slots.medicineName.value;
        console.log('medicineName: ' + medicineName);

        const repromptOutput = 'Would you like to check another medicine ?';
        const URL = 'https://medicinesconflict.free.beeceptor.com';
        
        try {
            const response = await getHttp(URL, medicineName);
            const objResp = JSON.parse(response);
            const numOfResults = objResp.length;
            
            let speakOutput = 'I checked ' + medicineName +  ' and found ' + numOfResults + ' conflicts that you <emphasis level="strong">should not</emphasis> take <break time="1s"/>';
                    
            for(var i = 0; i < numOfResults; i++){
                speakOutput += objResp[i].name + '     ';
            }
            
            console.log('response: ' + response);
            console.log('objResp: ' + objResp); 
            console.log('numOfResults: ' + numOfResults);
            console.log('speakOutput: ' + speakOutput);
            
            handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptOutput)     
        } catch(error) {
            console.log('error: ' + error);
            
            handlerInput.responseBuilder
                .speak('I was not able to find any data.')
                .reprompt(repromptOutput)
        }
        
        return handlerInput.responseBuilder
            .getResponse();
    }
};

        const getHttp = function(url, query) {
            return new Promise((resolve, reject) => {
                const request = https.get(`${url}/${query}`, response => {
                    response.setEncoding('utf8');
                   
                    let returnData = '';
                    if (response.statusCode < 200 || response.statusCode >= 300) {
                        return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
                    }
                   
                    response.on('data', chunk => {
                        returnData += chunk;
                    });
                   
                    response.on('end', () => {
                        resolve(returnData);
                    });
                   
                    response.on('error', error => {
                        reject(error);
                    });
                });
                request.end();
            });
        }
module.exports = MedicinesConflictIntentHandler;