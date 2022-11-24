const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '5937635884:AAGq0iM4B3hGOL1kSu9jSz8xC7rjzwOMeQU';
const webAppUrl = 'https://resonant-beijinho-331543.netlify.app/';
const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
const text = msg.text;

if (text === '/start') {
    await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
        reply_markup: {
            keyboard: [
                [{text: `Заполнить форму`, web_app: {url: webAppUrl + '/form'}}],
            ]
        }
    })

    await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Заполнить форму', web_app: {url: webAppUrl}}]
            ]
        }
    })
}

if (msg?.web_app_data?.data) {
    try {
        const data = JSON.parse(msg?.web_app_data?.data)
        await bot.sendMessage(chatId, 'Спасибо за обратную связь!');
        await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);

    } catch(e) {
        console.log(e)
    }
}
});

app.post('/web-data', async (req, res) => {
    const {queryId, products, totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {message_text: 'Поздравляю с покупкой' + totalPrice}
        })
        return res.status(208).json({})
    }catch(e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Не удалось приобрести товар',
            input_message_content: {message_text: 'Не удалось приобрести товар'}
        })
        return res.status(208).json({})
    }
})

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))