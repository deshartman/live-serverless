/**
 * Get an Access Token for an audience member
 */

const crypto = require('crypto');
const AccessToken = require('twilio').jwt.AccessToken;
const PlaybackGrant = AccessToken.PlaybackGrant;

exports.handler = async function (context, event, callback) {
    console.log(`event: ${JSON.stringify(event, null, 4)}`);

    const twilioClient = context.getTwilioClient();

    // function sendResponse(data) {
    //     const response = new Twilio.Response();
    //     response.appendHeader("Access-Control-Allow-Origin", "*");
    //     response.appendHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    //     response.appendHeader("Content-Type", "application/x-www-form-urlencoded");
    //     response.setBody(data);
    //     return response;
    // }

    console.log(`got to >>>-A`);
    // Generate a random string for the identity
    const identity = crypto.randomBytes(20).toString('hex');

    try {
        console.log(`got to >>>1`);
        // Get the first player streamer
        const playerStreamerList = await twilioClient.media.playerStreamer.list({ status: 'started' });
        console.log(`got to >>>2`);
        const playerStreamer = playerStreamerList.length ? playerStreamerList[0] : null;
        console.log(`got to >>>3`);
        // If no one is streaming, return a message
        if (playerStreamer) {
            // Otherwise create an access token with a PlaybackGrant for the livestream
            const token = new AccessToken(context.ACCOUNT_SID, CONTEXT.API_KEY, context.API_SECRET);
            console.log(`got to >>>4`);

            // Create a playback grant and attach it to the access token
            const playbackGrant = await twilioClient.media.playerStreamer(playerStreamer.sid).playbackGrant().create({ ttl: 60 });

            console.log(`got to >>>5`);
            const wrappedPlaybackGrant = new PlaybackGrant({
                grant: playbackGrant.grant
            });

            token.addGrant(wrappedPlaybackGrant);
            token.identity = identity;

            // Serialize the token to a JWT and return it to the client side
            callback(null, {
                token: token.toJwt()
            });

        } else {
            console.log(`got to >>>6`);
            callback(null, {
                message: `No one is streaming right now`,
            })
        }
    } catch (error) {
        callback(error, null);
    }

};








