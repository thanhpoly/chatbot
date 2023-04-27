const request = require("request");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const postWebhook = (req, res) => {
  let body = req.body;

  console.log(`\u{1F7EA} Received webhook:`);
  console.dir(body, { depth: null });
  if (body.object === "page") {
    body.entry.forEach(function (entry) {
      // Get the webhook event. entry.messaging is an array, but
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};

const getWebhook = (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === verifyToken) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};

const handleMessage = (sender_psid, received_message) => {
  let response;

  // Check if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an image!`,
    };
  } else if (received_message.attachments) {
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Welcome!",
              image_url: "https://petersfancybrownhats.com/company_image.png",
              subtitle: "We have the right hat for everyone.",
              default_action: {
                type: "web_url",
                url: "https://petersfancybrownhats.com/view?item=103",
                messenger_extensions: false,
                webview_height_ratio: "tall",
                fallback_url: "https://petersfancybrownhats.com/",
              },
              buttons: [
                {
                  type: "web_url",
                  url: "https://petersfancybrownhats.com",
                  title: "View Website",
                },
                {
                  type: "postback",
                  title: "Start Chatting",
                  payload: "DEVELOPER_DEFINED_PAYLOAD",
                },
              ],
            },
          ],
        },
      },
    };
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
};

// Handles messaging_postbacks events
const handlePostback = async (sender_psid, received_postback) => {
  let response;

  let payload = received_postback.payload;

  switch (payload) {
    case "GET_STARTED":
      await handleGetStarted(sender_psid);
      response = {
        text: `Welcome to my Messenger bot!`,
      };
      break;
    default:
      response = {
        text: `You sent the message: "${received_message.text}". Now send me an image!`,
      };
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
};

// Sends response messages via the Send API
const callSendAPI = (sender_psid, response) => {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};

const profile = (req, res) => {
  let request_body = {
    get_started: { payload: "GET_STARTED" },
    whitelisted_domains: ["https://chatbot-test-oltp.onrender.com"],
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: `https://graph.facebook.com/v16.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      console.log(body);
      if (!err) {
        console.log("Profile successfully set!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};

const getUserProfile = (sender_psid) => {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: "GET",
      },
      (err, res, body) => {
        if (!err) {
          body = JSON.parse(body);

          const username = `${body.first_name} ${body.last_name}`;
          // console.log("username111111111", username);
          resolve(username);
        } else {
          console.error("Unable to send message:" + err);
        }
      }
    );
  });
};

const handleGetStarted = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let username = await getUserProfile(sender_psid);
      console.log("username", username);
      let res = { text: `Welcome to my Messenger bot! Hello ${username}` };

      let res2 = sendGetStartedTemplate();
      console.log("res2", res2);

      // sent text message
      await callSendAPI(sender_psid, res);

      await callSendAPI(sender_psid, res2);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

const sendGetStartedTemplate = () => {
  let res = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Welcome!",
            image_url: "https://petersfancybrownhats.com/company_image.png",
            subtitle: "We have the right hat for everyone.",
            buttons: [
              {
                type: "postback",
                title: "Yasuo",
                payload: "DEVELOPER_DEFINED_PAYLOAD",
              },
              {
                type: "postback",
                title: "Zed",
                payload: "DEVELOPER_DEFINED_PAYLOAD",
              },
              {
                type: "postback",
                title: "Yone",
                payload: "DEVELOPER_DEFINED_PAYLOAD",
              },
            ],
          },
        ],
      },
    },
  };

  return res;
};

const getMessage = () => {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: `https://graph.facebook.com/v16.0/109138208808915/conversations?platform=messenger?access_token=${PAGE_ACCESS_TOKEN}`,
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: "GET",
      },
      (err, res, body) => {
        if (!err) {
          body = JSON.parse(body);
          console.log("body", body);
          resolve(body);
        } else {
          console.error("Unable to send message:" + err);
        }
      }
    );
  });
};

const setupPersistentMenu = (req, res) => {
  let request_body = {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: "postback",
            title: "Talk to an agent",
            payload: "CARE_HELP",
          },
          {
            type: "postback",
            title: "Outfit suggestions",
            payload: "CURATION",
          },
          {
            type: "web_url",
            title: "Shop now",
            url: "https://www.originalcoastclothing.com/",
            webview_height_ratio: "full",
          },
        ],
      },
    ],
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: `https://graph.facebook.com/v16.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      console.log(body);
      if (!err) {
        console.log("Persistent successfully set!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );

  res.status(200).send("ok");
};

module.exports = {
  postWebhook,
  getWebhook,
  handleMessage,
  handlePostback,
  callSendAPI,
  profile,
  getMessage,
  setupPersistentMenu,
};
