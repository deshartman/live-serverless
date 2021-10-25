exports.handler = function (context, event, callback) {
  console.log(`GOT TO WATCH: ${context.DOMAIN_NAME}`)




  callback(null, '');
};
