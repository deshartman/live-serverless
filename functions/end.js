/**
 * Start a new livestream with a Video Room, PlayerStreamer, and MediaProcessor
 */
exports.handler = function (context, event, callback) {
    console.log(`event: ${JSON.stringify(event, null, 4)}`);

    function sendResponse(data) {
        const response = new Twilio.Response();
        response.appendHeader("Access-Control-Allow-Origin", "*");
        response.appendHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
        response.appendHeader("Content-Type", "application/json");
        response.setBody(data);
        return response;
    }

    const twilioClient = context.getTwilioClient();

    const streamDetails = event.streamDetails;
    // End the player streamer, media processor, and video room
    const streamName = streamDetails.streamName;
    const roomId = streamDetails.roomId;
    const playerStreamerId = streamDetails.playerStreamerId;
    const mediaProcessorId = streamDetails.mediaProcessorId;

    try {
        await twilioClient.media.mediaProcessor(mediaProcessorId).update({ status: 'ended' });
        await twilioClient.media.playerStreamer(playerStreamerId).update({ status: 'ended' });
        await twilioClient.video.rooms(roomId).update({ status: 'completed' });

        callback(null, sendResponse({
            message: `Successfully ended stream ${streamName}`
        }));
    } catch (error) {
        callback(error, null);
    }

};
