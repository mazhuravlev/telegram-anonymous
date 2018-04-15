const Koa = require('koa');
const app = new Koa();
const axios = require('axios');

const name = process.env.name;
const webhook = process.env.webhook;

app.use(require('koa-bodyparser')());
app.use(async ctx => {
    if(!(name || webhook)) {
        ctx.body = 'error: config vars not set';
        return;
    }
    if(ctx.request.body.message) {
        const msg = (ctx.request.body.name || 'аноним') + ': '  + ctx.request.body.message;
        await axios.post(webhook, JSON.stringify({text: msg}), {headers: {
            'Content-Type': 'application/json',
        }});
    };
  ctx.body = `
    <h1>${name}</h1>
    <form method="post">
        Your name: <input name="name"/><br><br>
        <textarea rows="20" cols="100" name="message"></textarea><br><br>
        <button style="font-size: 24px;">Send</button>
    </form>`;
});

const port = process.env.PORT || 3007;
console.log(`Will listen on port ${port}`);
app.listen(port);