import { Expo } from "expo-server-sdk";
import Device from "../models/device.model.js";
const expo = new Expo();
async function pushToUser(userId, payload) {
  const devices = await Device.find({ userId }, { expoPushToken: 1 }).lean();
  const messages = [];

  for (const d of devices) {
    const token = d.expoPushToken;
    if (Expo.isExpoPushToken(token)) {
      messages.push({ to: token, sound: "default", ...payload });
    }
  }
  if (!messages.length) return [];

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  for (const chunk of chunks) {
    tickets.push(...(await expo.sendPushNotificationsAsync(chunk)));
  }
  return tickets; // (optional) store ticket ids in receipts later
}

export { pushToUser };
