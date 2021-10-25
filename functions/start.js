/**
 * Start a new livestream with a Video Room, PlayerStreamer, and MediaProcessor
 */
exports.handler = async function (context, event, callback) {
    console.log(`start event: ${JSON.stringify(event, null, 4)}`);

    // function sendResponse(data) {
    //     const response = new Twilio.Response();
    //     response.appendHeader("Access-Control-Allow-Origin", "*");
    //     response.appendHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    //     response.appendHeader("Content-Type", "application/json");
    //     response.setBody(data);
    //     return response;
    // }

    const twilioClient = context.getTwilioClient();
    const streamName = event.streamName;

    try {
        // Create the WebRTC Go video room, PlayerStreamer, and MediaProcessors
        const room = await twilioClient.video.rooms.create({
            uniqueName: streamName,
            type: 'go'
        });

        console.log(`>>>>>> 1`);

        const playerStreamer = await twilioClient.media.playerStreamer.create();

        console.log(`>>>>>> 2`);
        const mediaProcessor = await twilioClient.media.mediaProcessor.create({
            extension: 'video-composer-v1',
            extensionContext: JSON.stringify({
                identity: 'video-composer-v1',
                room: {
                    name: room.sid
                },
                outputs: [
                    playerStreamer.sid
                ],
            })
        });

        console.log(`>>>>>> 1`);

        callback(null,
            //sendResponse({
            {
                roomId: room.sid,
                streamName: streamName,
                playerStreamerId: playerStreamer.sid,
                mediaProcessorId: mediaProcessor.sid
            });
    } catch (error) {
        callback(error, null);
    }

};
