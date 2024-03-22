
const env = process.env;

// This is your test secret API key.
const stripe = require('stripe')(env.SECRET_TEST);
const express = require('express');
const app = express();
app.use(express.static('public'));
const path = require('path')


const YOUR_DOMAIN = env.DOMAIN + ":" + env.PORT;

app.post('/checkout', async (req, res) => {

  console.log("req", req)

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1Ox2h0065nngbryATsKcxKtg',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: env.DOMAIN,
    cancel_url: env.DOMAIN,
    automatic_tax: {enabled: true},
  });

  res.redirect(303, session.url);
});


app.post('/getStuff', async (req, res) => {
  const session = await stripe.get()

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/checkout.html'))
})