require("dotenv").config();
const { format, getDay } = require("date-fns");
const TelegramBot = require("node-telegram-bot-api");
const schedule = require("node-schedule");
const listMaksi = require("./listMaksi.js");

const groupChatId = process.env.GROUP_CHAT_ID;
const groupTopicId = process.env.GROUP_TOPIC_ID;

// initiate bot
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

// set commands
const commands = [
  {
    command: "/maksi_1",
    description: listMaksi[0].join(","),
  },
  {
    command: "/maksi_2",
    description: listMaksi[1].join(","),
  },
];
bot.setMyCommands(commands);

const sendMaksiPolling = (msg, options) => {
  const chatId = msg.chat.id;
  const date = format(new Date(), "dd MMMM yyyy");

  bot.sendPoll(chatId, `Makan Siang ${date}`, options, {
    is_anonymous: false,
    allows_multiple_answers: false,
    open_period: 60 * 60, // 30 minutes
    message_thread_id: msg.message_thread_id,
  });
};

// scheduling vote maksi di group sekte waw
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(2, 5)];
rule.hour = 10;
rule.minute = 35;
schedule.scheduleJob(rule, function () {
  let options = listMaksi[0];
  if (getDay(new Date()) % 2 !== 0) {
    options = listMaksi[1];
  }
  sendMaksiPolling({ chat: { id: groupChatId }, groupTopicId }, options);
});

// action commands
bot.onText(/\/maksi_1/, (msg) => {
  sendMaksiPolling(msg, listMaksi[0]);
});

bot.onText(/\/maksi_2/, (msg) => {
  sendMaksiPolling(msg, listMaksi[1]);
});
