const Alexa = require('ask-sdk-core');
const Settings = require('app-settings')("../settings.yml");
const Moment = require('moment-timezone');

const MedicinesReminderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MedicinesReminderIntent';
    },
    async handle(handlerInput) {
        const reqEnv = handlerInput.requestEnvelope;
        const permissions = reqEnv.context.System.user.permissions;
        const consentToken = permissions && permissions.consentToken;
        if(!consentToken) {
            return handlerInput.responseBuilder
                .addDirective({
                    type: "Connections.SendRequest",
                    name: "AskFor",
                    payload: {
                        "@type": "AskForPermissionsConsentRequest",
                        "@version": "1",
                        "permissionScope": "alexa::alerts:reminders:skill:readwrite"
                    }, 
                    token: "" 
                }).getResponse();
        }
        const slots = reqEnv.request.intent.slots;
        const reminderRequest = {
            "requestTime" : Moment().tz(Settings.dates.timezone).format(Moment.ISO_8601),
            "trigger": {
                "type" : "SCHEDULED_ABSOLUTE",
                "scheduledTime" : `${slots.date.value}T${slots.time.value}`,
                "timeZoneId" : Settings.dates.timezone,
                /*"recurrence" : {                     
                    "startDateTime": "2019-05-10T6:00:00.000",                       
                    "endDateTime" : "2019-08-10T10:00:00.000",  
                    "recurrenceRules" : [                                          
                        "FREQ=DAILY;BYHOUR=6;BYMINUTE=10;BYSECOND=0;INTERVAL=1;",
                        "FREQ=DAILY;BYHOUR=17;BYMINUTE=15;BYSECOND=0;INTERVAL=1;",
                        "FREQ=DAILY;BYHOUR=22;BYMINUTE=45;BYSECOND=0;INTERVAL=1;"
                    ]             
                }*/
            },
            "alertInfo": {
                "spokenInfo": {
                    "content": [{
                        "locale": "en-US", 
                        "text": `You should take ${slots.medicine.value} right now!`,
                    }]
                }
            },
            "pushNotification" : {                            
                "status" : "ENABLED"
            }
        }

        const reminderApiClient = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
        var speakOutput = `You have successfully scheduled a reminder for taking 
            ${slots.medicine.value} on ${slots.date.value} at ${slots.time.value}`;
        try {
            await reminderApiClient.createReminder(reminderRequest);
        } catch(error) {
            console.log(error);
            speakOutput = "There was an error scheduling your reminder. Please try again later.";
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

module.exports = MedicinesReminderIntentHandler;
