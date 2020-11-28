const Alexa = require('ask-sdk-core');
const Settings = require('../config.js')
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
        //
        console.log(`Settings.dates.timezone = ${Settings.dates.timezone}`);
        console.log(`Moment().tz(Settings.dates.timezone) = ${Moment().tz(Settings.dates.timezone)}`);
        console.log(`Settings.dates.format) = ${Settings.date.format}`);
        console.log(`Moment().tz(Settings.dates.timezone).format(Settings.dates.format) = 
            ${Moment().tz(Settings.dates.timezone).format(Settings.dates.format)}`);
        //
        const scheduledTime = `${slots.date.value}T${slots.time.value}`;
        const reminderRequest = {
            "requestTime" : Moment().tz(Settings.dates.timezone).format(Settings.dates.format),
            "trigger": {
                "type" : "SCHEDULED_ABSOLUTE",
                "scheduledTime" : scheduledTime,
                "timeZoneId" : Settings.dates.timezone,
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

        if(slots.isRecurring === "true") {
            if(slots.frequency) {
                const scheduledMoment = Moment(scheduledTime, Settings.dates.format);
                reminderRequest.trigger.recurrence = {
                    "startDateTime": "2019-05-10T6:00:00.000",
                    "endDateTime" : "2019-08-10T10:00:00.000",
                    "recurrenceRules" : [
                        `FREQ=${slots.frequency};
                        BYHOUR=${scheduledMoment.hour()};
                        BYMINUTE=${scheduledMoment.minute()};
                        BYSECOND=${scheduledMoment.second()};
                        INTERVAL=1;`,
                    ]
                }
            } else return handlerInput.responseBuilder
                .speak("How often this reminder should be repeated? You can set daily, weekly, or monthly reminder.")
                .addElicitSlotDirective("frequency", {
                    name: "MedicinesReminderIntent",
                    confirmationStatus: "NONE",
                    slots: {}
                })
                .reprompt()
                .getResponse();
        }

        const reminderApiClient = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
        var speakOutput = `You have successfully scheduled a reminder for taking 
            ${slots.medicine.value} on ${slots.date.value} at ${slots.time.value}.`;
        if(slots.isRecurring === "true") {
            speakOutput += `The reminder will be repeated ${slots.frequency}.`;
        }
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
