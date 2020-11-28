const Alexa = require('ask-sdk-core');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://drugdb:drugdbadmin@cluster0.zoed5.mongodb.net/drugsDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("database").collection("data");
    console.log(collection.countDocuments());
    client.close();
});

const MedicinesInfoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MedicinesInfoIntent';
    },
    handle(handlerInput) {
        const drugName = handlerInput.requestEnvelope.request.intent.slots.medicineName.value;

        var MongoClient = require('mongodb').MongoClient;
        let drugInfo;
        
        MongoClient.connect("mongodb+srv://drugdb:drugdbadmin@cluster0.zoed5.mongodb.net/drugsDB?retryWrites=true&w=majority", function (err, db) {

            db.collection('drugsInfo', function (err, collection) {
                const query = { "name": { "$eq": drugName } };
                var drugInfo = collection.findOne(query)
                .then(result => {
                  if(result) {
                    console.log(`Successfully found document: ${result}.`);
                  } else {
                    console.log("No document matches the provided query.");
                  }
                  return result;
                })
                .catch(err => console.error(`Failed to find document: ${err}`));

            });

        });

        return handlerInput.responseBuilder
            .speak(drugInfo.commonName)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

module.exports = MedicinesInfoIntentHandler;