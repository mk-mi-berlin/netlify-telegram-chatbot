const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const bot = new Telegraf(process.env.BOT_TOKEN);

let chatId = null;

bot.start(ctx => {
  console.log('started:', ctx.from.id);
  return ctx.reply('Welcome!');
});
bot.command('help', ctx => ctx.reply('Try send a sticker!'));
bot.hears('hi', ctx => ctx.reply('Hey there!'));
bot.hears('register', ctx => {
  chatId = ctx.chat.id;
  console.log(ctx.chat);
  return ctx.reply('Hey there!');
});
bot.hears(/buy/i, ctx => ctx.reply('Buy-buy!'));
bot.on('sticker', ctx => ctx.reply('👍'));
bot.startPolling();

const telegram = new Telegram(process.env.BOT_TOKEN);

const app = new Koa();

app.use(bodyParser());

app.use(async (ctx, next) => {
  console.log(ctx.request);
  next();
});

app.use(async ctx => {
  if (ctx.method === 'POST') {
    console.log(ctx.request.body);
    const body = ctx.request.body;
    if (body) {
      ctx.status = 201;
      telegram.sendMessage(chatId, JSON.stringify(body, null, 2));
    }
    ctx.status = 201;
    ctx.body = 'Post request';
  } else {
    ctx.body = 'Hello World';
  }
});

app.listen(3000);
console.log('server startet on port 3000');
