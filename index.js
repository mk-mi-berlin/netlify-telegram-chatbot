const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const { json } = require('micro');
const { parse } = require('url');

const bot = new Telegraf(process.env.BOT_TOKEN);
const telegram = new Telegram(process.env.BOT_TOKEN);

const chats = {};

bot.start(ctx => {
  console.log('started:', ctx.from.id);
  const chatid = ctx.chat.id;
  if (chatid in chats) chats[chatid] = chatid;
  console.log(`${chatid} registered! chats: ${chats}`);
  return ctx.reply(`Welcome! Your chatId is ${chatid}`);
});
bot.hears('register', ctx => {
  const chatid = ctx.chat.id;
  if (!(chatid in chats)) chats[chatid] = chatid;
  console.log(`${chatid} registered! chats: ${chats}`);
  return ctx.reply(`Welcome! Your chatId is ${chatid}`);
});
bot.command('help', ctx => ctx.reply('Try send a sticker!'));
bot.hears('hi', ctx => ctx.reply('Hey there!'));

module.exports = async req => {
  console.log('chats:', JSON.stringify(chats));
  if (req.method === 'POST') {
    const { query: { chatid } } = parse(req.url, true);
    if (!chatid) throw new Error('no chatid');
    if (!(chatid in chats)) throw new Error(`chatid ${chatid} not in database`);
    const body = await json(req);
    return telegram.sendMessage(chatid, body);
  }
  return 'This was just a GET request';
};

bot.startPolling();
