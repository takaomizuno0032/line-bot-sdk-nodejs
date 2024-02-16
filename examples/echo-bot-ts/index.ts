// Import all dependencies, mostly using destructuring for better view.
import {
  ClientConfig,
  MessageAPIResponseBase,
  messagingApi,
  middleware,
  MiddlewareConfig,
  webhook,
} from "@line/bot-sdk";
import express, { Application, Request, Response } from "express";

// Setup all LINE client and Express configurations.
const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
};

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET || "",
};

const PORT = process.env.PORT || 3000;

// Create a new LINE SDK client.
const client = new messagingApi.MessagingApiClient(clientConfig);

// Create a new Express application.
const app: Application = express();

// Function handler to receive the text.
const textEventHandler = async (
  event: webhook.Event,
): Promise<MessageAPIResponseBase | undefined> => {
  // Process all variables here.
  if (event.type !== "message" || !event.message) {
    return;
  }

  // Process all message related variables here.
  console.log("evnet:", JSON.stringify(event));
  // Create a new message.
  // Reply to the user.
  await client.replyMessage({
    replyToken: event.replyToken as string,
    messages: [
      {
        type: "text",
        text: event.message,
      },
    ],
  });
};

// Register the LINE middleware.
// As an alternative, you could also pass the middleware in the route handler, which is what is used here.
// app.use(middleware(middlewareConfig));

// Route handler to receive webhook events.
// This route is used to receive connection tests.
app.get("/", async (_: Request, res: Response): Promise<Response> => {
  return res.status(200).json({
    status: "success",
    message: "Connected successfully!",
  });
});

// This route is used for the Webhook.
app.post(
  "/callback",
  middleware(middlewareConfig),
  async (req: Request, res: Response): Promise<Response> => {
    const callbackRequest: webhook.CallbackRequest = req.body;
    const events: webhook.Event[] = callbackRequest.events!;

    // Process all the received events asynchronously.
    const results = await Promise.all(
      events.map(async (event: webhook.Event) => {
        try {
          await textEventHandler(event);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
          }

          // Return an error message.
          return res.status(500).json({
            status: "error",
          });
        }
      }),
    );

    // Return a successfull message.
    return res.status(200).json({
      status: "success",
      results,
    });
  },
);

// Create a server and listen to it.
app.listen(PORT, () => {
  console.log(`Application is live and listening on port ${PORT}`);
});
