
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// The daily task reminder function
exports.dailyTaskReminder = functions.pubsub
  .schedule('every day 09:00')
  .timeZone('Europe/Berlin') // UTC+1
  .onRun(async (context) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;

    const usersSnapshot = await db.collection('TestCollection').get();
    const promises = [];

    usersSnapshot.forEach((userDoc) => {
      const userId = userDoc.id;
      const userData = userDoc.data();
      const tasks = userData.tasks || [];

      const todayTasks = tasks.filter(task => task.date === todayString);
      const taskCount = todayTasks.length;

      if (taskCount > 0) {
        const messageText = `You have ${taskCount} tasks to complete today!`;

        // 1. Save message in Firestore
        const message = {
          text: messageText,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          type: 'reminder'
        };

        const messageRef = db.collection('messages').doc(userId).collection('userMessages').doc();
        promises.push(messageRef.set(message));

        // 2. Send Push Notification if user has fcmToken
        const token = userData.fcmToken;

        if (token) {
          const payload = {
            notification: {
              title: "Task Reminder",
              body: messageText,
            }
          };

          promises.push(admin.messaging().sendToDevice(token, payload));
        }
      }
    });

    await Promise.all(promises);

    console.log('Daily task reminders sent for', todayString);
    return null;
  });

// Manual test endpoint to trigger the task reminder
exports.manualTaskReminder = functions.https.onRequest(async (req, res) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayString = `${yyyy}-${mm}-${dd}`;

  const usersSnapshot = await db.collection('TestCollection').get();
  const promises = [];

  usersSnapshot.forEach((userDoc) => {
    const userId = userDoc.id;
    const userData = userDoc.data();
    const tasks = userData.tasks || [];

    const todayTasks = tasks.filter(task => task.date === todayString);
    const taskCount = todayTasks.length;

    if (taskCount > 0) {
      const messageText = `You have ${taskCount} tasks to complete today!`;

      // 1. Save message in Firestore
      const message = {
        text: messageText,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        type: 'reminder'
      };

      const messageRef = db.collection('messages').doc(userId).collection('userMessages').doc();
      promises.push(messageRef.set(message));

      // 2. Send Push Notification if user has fcmToken
      const token = userData.fcmToken;

      if (token) {
        const payload = {
          notification: {
            title: "Task Reminder",
            body: messageText,
          }
        };

        promises.push(admin.messaging().sendToDevice(token, payload));
      }
    }
  });

  await Promise.all(promises);

  console.log('Manual task reminder sent for', todayString);

  res.send('Manual task reminder sent!');
});
