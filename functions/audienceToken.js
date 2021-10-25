/**
 * Get an Access Token for an audience member
 */

const crypto = require('crypto');
const AccessToken = require('twilio').jwt.AccessToken;
const PlaybackGrant = AccessToken.PlaybackGrant;

exports.handler = function (context, event, callback) {
    console.log(`event: ${JSON.stringify(event, null, 4)}`);

    // Build a mapping of headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Content-Type": "application/json",
    };

    // Set headers in response
    response.setHeaders(headers);

    const twilioClient = context.getTwilioClient();

    // Generate a random string for the identity
    const identity = crypto.randomBytes(20).toString('hex');

    // Get the user's identity and the room name from the request
    const identity = event.identity;
    const roomName = event.room;

    try {
        // Get the first player streamer
        const playerStreamerList = await twilioClient.media.playerStreamer.list({ status: 'started' });
        const playerStreamer = playerStreamerList.length ? playerStreamerList[0] : null;

        // If no one is streaming, return a message
        if (playerStreamer) {
            // Otherwise create an access token with a PlaybackGrant for the livestream
            const token = new AccessToken(context.ACCOUNT_SID, CONTEXT.API_KEY, context.API_SECRET);

            // Create a playback grant and attach it to the access token
            const playbackGrant = await twilioClient.media.playerStreamer(playerStreamer.sid).playbackGrant().create({ ttl: 60 });

            const wrappedPlaybackGrant = new PlaybackGrant({
                grant: playbackGrant.grant
            });

            token.addGrant(wrappedPlaybackGrant);
            token.identity = identity;

            // Serialize the token to a JWT and return it to the client side
            callback(null, response({
                token: token.toJwt()
            }));

        } else {
            callback(null, {
                message: `No one is streaming right now`,
            })
        }
    } catch (error) {
        callback(error, null);
    }

};








