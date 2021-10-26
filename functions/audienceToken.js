/**
 * Get an Access Token for an audience member
 */

const crypto = require('crypto');
const AccessToken = require('twilio').jwt.AccessToken;
const PlaybackGrant = AccessToken.PlaybackGrant;

exports.handler = async function (context, event, callback) {
    console.log(`Audience Token event: ${JSON.stringify(event, null, 4)}`);

    const twilioClient = context.getTwilioClient();

    // Generate a random string for the identity
    const identity = crypto.randomBytes(20).toString('hex');

    try {
        // Get the first player streamer
        const playerStreamerList = await twilioClient.media.playerStreamer.list({ status: 'started' });
        const playerStreamer = playerStreamerList.length ? playerStreamerList[0] : null;

        // If no one is streaming, return a message
        if (!playerStreamer) {
            callback(null, {
                message: `No one is streaming right now`,
            });
        }

        // Otherwise create an access token with a PlaybackGrant for the livestream
        const token = new AccessToken(context.ACCOUNT_SID, context.API_KEY, context.API_SECRET);

        // Create a playback grant and attach it to the access token
        const playbackGrant = await twilioClient.media.playerStreamer(playerStreamer.sid).playbackGrant().create({ ttl: 60 });

        const wrappedPlaybackGrant = new PlaybackGrant({
            grant: playbackGrant.grant
        });

        token.addGrant(wrappedPlaybackGrant);
        token.identity = identity;

        // Serialize the token to a JWT and return it to the client side
        callback(null, {
            token: token.toJwt()
        });

    } catch (error) {
        callback(error, null);
    }
}