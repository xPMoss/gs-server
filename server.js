
const env = require('./environment/environment');
//const env = process.env;

// This is your test secret API key.
const stripe = require('stripe')("sk_test_51Owtf1065nngbryAiEp1d2oa0VifQpOyKngvHNREZIoTEM11oPaJH5tnvwZFNp4Euqn583KqwmOAMKXAjxgsNFBa00p0w2eNsq");

// CRYPTO //
const crypto = require('crypto');
let jwt = require('jsonwebtoken');

// 
var cors = require('cors')

const bodyParser = require("body-parser");
const path = require('path')

// EXPRESS //
const express = require('express');
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// HTTP //
const http = require('http');
const server = http.createServer(app);


const YOUR_DOMAIN = env.DOMAIN + ":" + env.PORT;

//
app.post('/test', cors(), async (req, res)=>{


  const products = await stripe.products.list({
  });

  const prices = await stripe.prices.list({
  });

  for (const prod of products.data) {
    //await stripe.products.del(prod.id);

    
  }

  res.json({products:products, prices:prices});

});

// Customer
app.get('/get-customer', cors(), async (req, res)=>{
  console.clear()

  try{
    console.log("id->", req.query.id)

    const customer = await stripe.customers.retrieve(req.query.id);
    console.log("customer", customer)

    res.json(customer);
  }
  catch(e){
    return res.json({
      success: false,
      status: 'No such customer:'+ req.query.id
    });

  }

})

app.post('/create-customer', cors(), async (req, res)=>{
  /*
  address (object)
  The customer’s address.
    address.city (string)
    City, district, suburb, town, or village.

    address.country (string)
    Two-letter country code (ISO 3166-1 alpha-2).

    address.line1 (string)
    Address line 1 (e.g., street, PO Box, or company name).

    address.line2 (string)
    Address line 2 (e.g., apartment, suite, unit, or building).

    address.postal_code (string)
    ZIP or postal code.

    address.state (string)
    State, county, province, or region.


  description (string)
  An arbitrary string that you can attach to a customer object. It is displayed alongside the customer in the dashboard.

  email (string)
  Customer’s email address. It’s displayed alongside the customer in your dashboard and can be useful for searching and tracking. This may be up to 512 characters.

  metadata (object)
  Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Individual keys can be unset by posting an empty value to them. All keys can be unset by posting an empty value to metadata.

  name (string)
  The customer’s full name or business name.

  phone (string)
  The customer’s phone number.

  shipping (object)
  object
      shipping.address (object) Required
      Customer shipping address.

      shipping.name (string) Required
      Customer name.

      shipping.phone (string)

  */

  console.clear()
  console.log("body->", req.body)

  let data = {
    address:{
      city:null,
      country:null,
      line1:null,
      line2:null,
      postal_code:null,
      state:null,
    },
    description:null,
    email:null,
    metadata:{

    },
    name:null,
    phone:null,
    shipping:{
      address:{

      },
      name:null,
      phone:null
    }
  }

  try{
    console.log("id->", req.body.id)

    const customer = await stripe.customers.create(data);
    console.log("customer", customer)

    res.json(customer);
  }
  catch(e){
    return res.json({
      success: false,
      status: 'Failed to creat customer:'+ req.body.id
    });

  }


})

app.post('/update-customer', cors(), async (req, res)=>{
  console.clear()
  console.log("body->", req.body)

  let data = {
    address:{
      city:null,
      country:null,
      line1:null,
      line2:null,
      postal_code:null,
      state:null,
    },
    description:null,
    email:null,
    metadata:{

    },
    name:null,
    phone:null,
    shipping:{
      address:{

      },
      name:null,
      phone:null
    }
  }

  try{
  
    const customer = await stripe.customers.update(
      req.body.id,
      data
    );
    console.log("customer", customer)

    res.json(customer);
  }
  catch(e){
    return res.json({
      success: false,
      status: 'Failed to update customer:'+ req.body.id
    });

  }



})


app.post('/delete-customer', cors(), async (req, res)=>{
  console.clear()
  


  try{
    console.log("id->", req.body.id)

    const deleted = await stripe.customers.del(req.body.id);
    console.log("deleted", deleted)

    res.json(deleted);
  }
  catch(e){
    return res.json({
      success: false,
      status: 'Failed to delete customer:'+ req.body.id
    });

  }

})





// Products
app.get('/get-product', cors(), async (req, res)=>{
  console.clear()

  try{
    const product = await stripe.products.retrieve(req.query.id);
    console.log("product", product)

    res.json(product);
  }
  catch(e){
    return res.json({
      success: false,
      status: 'No such product:'+ req.query.id
    });

  }

});

app.post('/create-product', cors(), async (req, res)=>{
  console.clear()
  console.log("body->", req.body)

  let data = {
    id:req.body.id,
    name:req.body.name,
    description:req.body.description,
    active:req.body.active,
    metadata:{category:req.body.category},
    //default_price:null
  }

  /*
default_price_data:{
    currency: 'sek',
      unit_amount: req.body.price,
  },

  */
  try{
    const product = await stripe.products.create(data);
    console.log("product", product)

    /*
    const price = await stripe.prices.create({
      currency: 'sek',
      unit_amount: req.body.price,
      product:req.body.id
    });
    */

    res.json(product);
  }
  catch(e){
    return res.json({
      success: false,
      status: 'Failed to create product:'+ req.body.id
    });

  }


});

app.post('/update-product', cors(), async (req, res)=>{
  console.clear()
  console.log("body->", req.body)

  let data = {
    name:req.body.name,
    description:req.body.description,
    active:req.body.active,
    metadata:{category:req.body.category},
    //default_price:null

  }

  try{
    /*
    
    const price = await stripe.prices.update(
      'price_1MoBy5LkdIwHu7ixZhnattbh',
      {
        metadata: {
          order_id: '6735',
        },
      }
    );
    */

    const product = await stripe.products.update(
      req.body.id,
      data
    );
    console.log("product", product)

    if(product.default_price == null){
      const priceCreate = await stripe.prices.create({
        currency: 'sek',
        unit_amount: req.body.price*100,
        product: product.id
      });
      console.log("priceCreate", priceCreate)

      data.default_price = priceCreate.id;
      const productUpdate = await stripe.products.update(
        req.body.id,
        data
      );
      console.log("productUpdate", productUpdate)

    }
    else{
      const priceUpdate = await stripe.prices.update(
        product.default_price,
        {
          currency_options:{
            currency: 'sek',
            unit_amount: req.body.price*100,
          }        
        }
      );
      console.log("priceUpdate", priceUpdate)


    }

    res.json(product);
  }
  catch(e){
    return res.json({
      success: false,
      status: 'Failed to update product:'+ req.body.id
    });

  }

});

app.post('/delete-product', cors(), async (req, res)=>{
  console.clear()
  console.log("body->", req.body)


  /*
  const product = await stripe.products.del(req.body.id);

  res.json(product);
  */

  try{
    const product = await stripe.products.del(req.body.id);
    console.log("product", product)

    res.json(product);
  }
  catch(e){
    return res.json({
      success: false,
      status: 'Failed to delete product:'+ req.body.id
    });

  }


});


// Checkout
app.post('/checkout', async (req, res)=>{

  //console.log("req:----", req)
  console.log("body->", req.body)



  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: price,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: "http://localhost:4200/pay",
    cancel_url: "http://localhost:4200/pay",
    automatic_tax: {enabled: true},
  });
  
  res.redirect(303, session.url);
  
});

// Misc
app.post('/getStuff', async (req, res) => {
  const session = await stripe.get()

  res.redirect(303, session.url);
});

// Init
app.listen(4242, () => console.log('Running on port 4242'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/checkout.html'))
})