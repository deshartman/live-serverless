/**
 * Start a new livestream with a Video Room, PlayerStreamer, and MediaProcessor
 */
exports.handler = function (context, event, callback) {
    console.log(`start event: ${JSON.stringify(event, null, 4)}`);


    callback(null, { Hello });

};
