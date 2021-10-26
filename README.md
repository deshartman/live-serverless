# Twilio Livecast Serverless

The Twilio Livecast Serverless is part of the Twilio Livecast Flex plugin and allows a pod- or video-caster to have a single pane of glass for all communication components of their cast in one environment.
The video casting is built right into Flex as a panel, so you can start or stop casting as needed.

Viewer can then interact with you in their preferred way by sending SMS and WhatsApp messages to your Flex number or even call in to chat to you.

You have all the power of Flex to queue tasks, swap between different tasks and can even have support staff initially answer and vet calls or messages. Gone are
the days of having complex PBX or EKTS systems for your station. Now you have a full powered, flexible communications environment (Flex) right in your browser alongside a powerful,
low latency broadcasting video service (Live).

## Setup

There are two components to the setup:

Part 1. Twilio Live Serverless
Part 2. Flex plugin

### Part 1 - Twilio Live Serverless

1. Clone this repo

2. Make sure you are in the root directory and then update dependencies

```
npm install
```

3. Copy the .env.copy file to .env

```
cp .env.copy .env
```

4. Update the .env file with Account SID and an API Key/Secret pair.
   See "API Keys" section of this article for details: https://www.twilio.com/blog/better-twilio-authentication-csharp-twilio-api-keys

5. Deploy the service to Twilio Functions

```
twilio serverless:deploy
```

6. Once done, copy the Domain from the Deployments details output and note the two URLs bolded below. These are the Streamer and the Viewer URLs.

```
Deployment Details
Domain: live-serverless-XXXX-dev.twil.io
Service:
   live-serverless (ZSaaaaaaa)
Environment:
   dev (ZEddddd)
Build SID:
   ZBbbbbbbbb
Runtime:
   node12
View Live Logs:
   https://www.twilio.com/console/functions/editor/.....
Functions:
   https://live-serverless-XXXX-dev.twil.io/audienceToken
   https://live-serverless-XXXX-dev.twil.io/end
   https://live-serverless-XXXX-dev.twil.io/start
   https://live-serverless-XXXX-dev.twil.io/streamerToken
Assets:
   https://live-serverless-XXXX-dev.twil.io/assets/index.html
   *https://live-serverless-XXXX-dev.twil.io/audience.html*
   https://live-serverless-XXXX-dev.twil.io/audience.js
   https://live-serverless-XXXX-dev.twil.io/livePlayer/twilio-live-player-wasmworker-1-5-0.min.js
   https://live-serverless-XXXX-dev.twil.io/livePlayer/twilio-live-player-wasmworker-1-5-0.min.wasm
   https://live-serverless-XXXX-dev.twil.io/livePlayer/twilio-live-player.min.js
   *https://live-serverless-XXXX-dev.twil.io/streamer.html*
   https://live-serverless-XXXX-dev.twil.io/streamer.js
```

### Part 2 - Flex plugin

1. Clone the repo located here: https://github.com/deshartman/plugin-live-cast

2. Make sure you are in the root directory and then update dependencies

```
npm install
```

3. Update the URL in /src/components/LiveCast.js to the URL for the Live Serverless functions in Step 1 above:

```javascript
  render() {
    return (
      <div style={{minHeight: '100vh'}}>

        <iframe src='https://live-serverless-XXXX-dev.twil.io/streamer.html'

         allow='camera; microphone'
         height='100%' width='100%' />
      </div>
    );
  }

```

NOTE: Make sure you only replace the XXXX with your Functions value.

4. Test the plugin locally

```
twilio flex:plugins:start

```

5. Once started, allow camera and microphone access on your browser if asked.

6. Supply a your name and a stream name.

7. Click the Start Stream. You should see "Live" appear on the window, indicating the stream is now live.

8. Open a new browser window and go to https://live-serverless-XXXX-dev.twil.io/audience.html (replacing XXXX with your previously deployed function value)

9. Click "watch Stream". This should now show you the stream (Slightly delayed)

10. At this point you can WhatsApp, SMS, WebChat and even call into the main Flex number, handling these channels as you would normally, interacting with
    the audience all while you are broadcasting a Live stream.
