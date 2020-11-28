const Alexa = require('ask-sdk-core');

/* const aws = require('aws-sdk');
const s3 = new aws.S3();
*/

const MedicinesInfoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MedicinesInfoIntent';
    },
    handle(handlerInput) {
        const drugName = handlerInput.requestEnvelope.request.intent.slots.medicineName.value;
        
        var fs = require('fs');
        var data = JSON.parse(fs.readFileSync('./intents/data.json', 'utf8'));
        
        
        return handlerInput.responseBuilder
            .speak(data[drugName])
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


/*
const lookupMedicine = (medicineName) => {
    return new Promise((resolve, reject) => {
        try {
            const bucketName = '8e93a926-0a2a-4fdf-b1db-fd216179d85a-eu-west-1'; //process.env.S3_PERSISTENCE_BUCKET;
            const keyName = 'Media/Doctoor.MedicinesInfo/RPL.csv';
            const query = `SELECT id from S3Object s WHERE s.name ='${medicineName}' LIMIT 1`;
            let returnVal = 0;
            
            const params = {
              Bucket: bucketName,
              Key: keyName,
              ExpressionType: 'SQL',
              Expression: query,
              InputSerialization: {
                CSV: {
                  FileHeaderInfo: 'USE',
                },
                CompressionType: 'NONE',
              },
              OutputSerialization: {
                CSV: {
                },
              }
            };
            
            console.log('start select');
            s3.selectObjectContent(params, (err, data) => {
            	if (err) {
            		reject(0);
            	}
            
                console.log("retrieving data!!");
                console.log(data);
            	const eventStream = data.Payload;
            	
            	eventStream.on('data', (event) => {
            		if (event.Records) {
            			returnVal = event.Records.Payload.toString();
            			resolve(returnVal);
            		} else if (event.Stats) {
            			console.log(`Processed ${event.Stats.Details.BytesProcessed} bytes`);
            		} else if (event.End) {
            		    console.log('SelectObjectContent completed');
            		}
            	});
            
            	// Handle errors encountered during the API call
            	eventStream.on('error', (err) => {
            		switch (err.name) {
            			// Check against specific error codes that need custom handling
            		}
            	});
            	eventStream.on('end', () => {
            		// Finished receiving events from S3
            		console.log(`returning: ${returnVal}`);
            	    resolve(returnVal);
            	});
            });
        } catch (e) {
            console.log(e);
            reject(0);
        }
    })
};
*/
module.exports = MedicinesInfoIntentHandler;