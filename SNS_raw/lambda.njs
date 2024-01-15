import https from 'node:https';
import { URL } from 'node:url';
const accountDetails = 'Hardcoded Account Details';

export const handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    try {
        // Extracting the AWS Account ID from the Lambda ARN
        const accountId = context.invokedFunctionArn.split(":")[4];
        console.log('AWS Account ID:', accountId);

        // Parsing the message from the SNS event
        const message = event.Records[0].Sns.Message;
        console.log('Parsed message:', message);

        // Teams webhook URL from environment variable
        const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
        const url = new URL(webhookUrl);

        // Preparing the request options for Teams
        const requestOptions = {
            hostname: url.hostname,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // Teams message format
        const teamsMessage = JSON.stringify({
            text: `Account ID: **${accountId}**\n\nAccount Details: **${accountDetails}**\n\nMessage:\n\n${message}`
        });

        // Promise to send a message to Teams
        const sendMessageToTeams = new Promise((resolve, reject) => {
            const req = https.request(requestOptions, (res) => {
                console.log(`STATUS: ${res.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    console.log(`BODY: ${chunk}`);
                });
                res.on('end', () => {
                    console.log('No more data in response.');
                    resolve('Message sent to Teams');
                });
            });

            req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
                reject(`Failed to send message: ${e.message}`);
            });

            // Sending the message
            req.write(teamsMessage);
            req.end();
        });

        // Await and return the result of the message sending
        return await sendMessageToTeams;
    } catch (error) {
        console.error('Error in Lambda execution:', error);
        throw new Error(`Execution failed: ${error.message}`);
    }
};
