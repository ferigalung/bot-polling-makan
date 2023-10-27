require("dotenv").config();
const { format } = require("date-fns");
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
    command: "/maksi",
    description: 'Voting tempat makan siang',
  }
];
bot.setMyCommands(commands);

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const sendMaksiPolling = (msg, options) => {
  const chatId = msg.chat.id;
  const date = format(new Date(), "dd MMMM yyyy");

  bot.sendPoll(chatId, `Makan Siang ${date}`, shuffleArray(options).slice(0, 5), {
    is_anonymous: false,
    allows_multiple_answers: false,
    open_period: 60 * 60, // 30 minutes
    message_thread_id: msg.message_thread_id,
  });
};

// scheduling vote maksi di group sekte waw
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(2, 5)];
rule.hour = 3; // 3:30 US West Time -> 10:30 WIB
rule.minute = 30;
schedule.scheduleJob(rule, function () {
  sendMaksiPolling({ chat: { id: groupChatId }, message_thread_id: groupTopicId }, listMaksi);
});

// action commands
bot.onText(/\/maksi/, (msg) => {
  sendMaksiPolling(msg, listMaksi);
});
