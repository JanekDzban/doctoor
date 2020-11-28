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
        const scheduledTime = `${slots.date.value}T${mapTimeToHour(slots.time.value)}`;
        const scheduledMoment = Moment(scheduledTime, Settings.dates.format);
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
        console.log(`slots.isRecurring.value = ${getSynonymSlotValue(slots.isRecurring.name, slots)}`);
        if(slots.isRecurring.value === "true" || getSynonymSlotValue(slots.isRecurring.name, slots) === "true") {
            if(slots.frequency.value) {
                const frequency = getSynonymSlotValue(slots.frequency.name, slots);
                console.log(`slots.frequency.value = ${frequency}`);
                reminderRequest.trigger.recurrence = {
                    "startDateTime": scheduledTime,
                    "recurrenceRules" : [
                        `FREQ=${frequency.toUpperCase()};
                        BYHOUR=${scheduledMoment.hour()};
                        BYMINUTE=${scheduledMoment.minute()}`
                    ]
                }
                var add = "";
                switch(frequency) {
                    case "weekly": add = `;BYDAY=${scheduledMoment.format("dd").toUpperCase()};`; break;
                    case "monthly": add = `;BYMONTHDAY=${scheduledMoment.format("D")}`; break;
                }
                reminderRequest.trigger.reccurence.reccurenceRules[0] += add;
            } else { 
                return handlerInput.responseBuilder
                    .speak("How often this reminder should be repeated? You can set daily, weekly, or monthly reminder.")
                    .addElicitSlotDirective('frequency', reqEnv.request.intent)
                    .getResponse();
            }
        }

        const reminderApiClient = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
        var speakOutput = `You have successfully scheduled a reminder for taking 
            ${slots.medicine.value} on ${slots.date.value} at ${scheduledMoment.hour()}`;
        if(scheduledMoment.minute() > 0) {
            speakOutput += `:${('0' + scheduledMoment.minute()).slice(-2)}`;
        }
        if(slots.isRecurring.value === "true" || getSynonymSlotValue(slots.isRecurring.name, slots) === "true") {
            speakOutput += `. The reminder will be repeated ${getSynonymSlotValue(slots.frequency.name, slots)}.`;
        }
        console.log(reminderRequest);
        console.log(speakOutput);
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

function mapTimeToHour(time) {
    const map = {
        "MO" : "08:00",
        "AF" : "13:00",
        "EV" : "18:00",
        "NI" : "23:00"
    }
    return map[time] ? map[time] : time;
}

function getSynonymSlotValue(slotName, slots) {
    return slots[slotName].resolutions.resolutionsPerAuthority[0].values[0].value.name;
}

module.exports = MedicinesReminderIntentHandler;
