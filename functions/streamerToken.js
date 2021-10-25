/**
 * Start a new livestream with a Video Room, PlayerStreamer, and MediaProcessor
 */

const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

exports.handler = async function (context, event, callback) {
    console.log(`event: ${JSON.stringify(event, null, 4)}`);

    function sendResponse(data) {
        const response = new Twilio.Response();
        response.appendHeader("Access-Control-Allow-Origin", "*");
        response.appendHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
        response.appendHeader("Content-Type", "application/x-www-form-urlencoded");
        response.setBody(data);
        return response;
    }

    // Get the user's identity and the room name from the request
    const identity = event.identity;
    const roomName = event.room;

    try {
        if (event.identity || event.room) {
            // Create a video grant for this specific room
            const videoGrant = new VideoGrant({
                room: roomName,
            });

            // Create an access token
            const token = new AccessToken(context.ACCOUNT_SID, CONTEXT.API_KEY, context.API_SECRET);

            // Add the video grant and the user's identity to the token
            token.addGrant(videoGrant);
            token.identity = identity;

            // Serialize the token to a JWT and return it to the client side

            callback(null, sendResponse({
                token: token.toJwt()
            }));
        } else {
            callback(null, sendResponse({ message: `Missing identity or stream name` }));
        }
    } catch (error) {
        callback(error, null);
    }

};






