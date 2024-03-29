
// Imports
// #region
require('dotenv').config()
//const env = require('./src/environment/environment');
const env = process.env;

// This is your test secret API key.
const stripe = require('stripe')(env.SECRET);

// CRYPTO //
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJwt = require('passport-jwt')
const bcrypt = require('bcrypt');
const uuid = require('uuid');

//
const nodemailer = require('nodemailer');

//
const verifyToken = require('./src/middleware/auth');

// 
const cors = require('cors')

const bodyParser = require("body-parser");
const path = require('path')

// EXPRESS //
const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
  
});

// HTTP //
const http = require('http');
const server = http.createServer(app);

const YOUR_DOMAIN = env.DOMAIN + ":" + env.PORT;
// #endregion


// SÄKERHET/HASH PASSWORD //
//


// TEST
app.get('/test', cors(), verifyToken, async (req, res)=>{


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
// #region
app.get('/get-customer', cors(), verifyToken, async (req, res)=>{
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

app.post('/create-customer', cors(), verifyToken, async (req, res)=>{
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

app.post('/update-customer', cors(), verifyToken, async (req, res)=>{
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

app.post('/delete-customer', cors(), verifyToken, async (req, res)=>{
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
// #endregion


// Products
// #region
app.get('/get-product', cors(), verifyToken, async (req, res)=>{
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

app.post('/create-product', cors(), verifyToken, async (req, res)=>{
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
      status: 'Failed to create product:'+ req.body.id
    });

  }


});

app.post('/update-product', cors(), verifyToken, async (req, res)=>{
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

app.post('/delete-product', cors(), verifyToken, async (req, res)=>{
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


app.post('/create-base-product', cors(), verifyToken, async (req, res)=>{
  console.clear()
  console.log("body->", req.body)

  let body = req.body;
  let uid = uuid.v4();

  let data = {
    id: body.category + "_" + uid,
    name: body.title,
    metadata:{category: body.category},
  }

  console.log(data)

  
  try{
    let product = await stripe.products.create(data);
    console.log("product", product)

    res.json(product);
  }
  catch(e){
    return res.json({
      success: false,
      status: 'Failed to create product:'+ data.id
    });

  }


});

app.post('/create-base-products', cors(), verifyToken, async (req, res)=>{
  console.clear()
  console.log("body->", req.body)

  let body = req.body;
  let products = []

  let uid = uuid.v4();
  let data = {
    id: "shipping_" + uid,
    name: "Frakt",
    metadata:{category: "shipping", product: "shipping"},
  }
  let product = await stripe.products.create(data);

  /*
  for(let item of body.items){

    let uid = uuid.v4();

    let data = {
      id: item.category + "_" + uid,
      name: item.title,
      metadata:{category: item.category},
    }
  
    console.log(data)
  
    
    try{
      let product = await stripe.products.create(data);
      console.log("product", product)
      products.push(product)

    }
    catch(e){
      return res.json({
        success: false,
        status: 'Failed to create product:' + item.title
      });
  
    }

    
  }
  */
 
  return res.status(200).json(products);
});

app.post('/create-base-prices', cors(), verifyToken, async (req, res)=>{
  console.clear()
  console.log("body->", req.body)

  let body = req.body;
  let uids = body.uids

  

  console.log(body)

  
  try{
    let x = 0
    for (const id of uids) {
      let pr = [5,10,15,20,30,40,50,60,70,80,90,100]

      for (const iterator of pr) {
        const priceCreate = await stripe.prices.create({
          currency: 'sek',
          unit_amount: iterator*100,
          product: id,
          metadata:{category: body.categories[x]},
        });
        console.log("priceCreate", priceCreate)
        x++;
      }


    }
    
    return res.status(200).json({success:"success"});
   
  }
  catch(e){
    return res.json({
      success: false,
      status: 'Failed to create prices'
    });

  }


});
// #endregion


// Checkout
app.post('/test-checkout', cors(), verifyToken, async (req, res)=>{

  //console.log("req:----", req)
  console.log("body->", req.body)

  let body = req.body
  let items = req.body.items

  let products = []
  let prices = []

  let stripeObjects = {
    bracelets:{
      product:null,
      prices:[]
    },
    necklaces:{
      product:null,
      prices:[]
    },
    earrings:{
      product:null,
      prices:[]
    },
    keyrings:{
      product:null,
      prices:[]
    },

  }

  // Get products and prices
  let stripeProducts = await stripe.products.list({
    active:true,
    limit:100
  });

  
  for(let item of stripeProducts.data){
    if(item.metadata['category'] && item.metadata['category'] != "shipping"){
      stripeObjects[item.metadata['category']].product = item

    }

  }

  let stripePrices = await stripe.prices.list({
    active:true,
    limit:100
  });


  let orderProducts = []
  for(let item of items){
    
    let foundProduct = stripeObjects[item.category].product

    orderProducts.push(
      {
        id:foundProduct.id,
        price:item.price*100
      }
      
    )

  }

  // Add line_items
  let line_items = []
  for(let item of orderProducts){
    
    let cPrice = {
      currency: 'sek',
      unit_amount: item.price,
      product: item.id
    }

    let order_item = {
      price_data: cPrice,
      quantity: 1,
    }

    line_items.push(order_item)
    
  }

  // Add shipping
  let shipping = {
    currency: 'sek',
    unit_amount: 1900,
    product: "shipping_bb14879f-3d6e-4230-a8a8-e5df34508777"

  }
  let shipping_item = {
    price_data: shipping,
    quantity: 1,
  }
  line_items.push(shipping_item)
  
  
  const session = await stripe.checkout.sessions.create({
    customer_email:body.email,
    line_items: line_items,
    mode: 'payment',
    success_url: req.body.success_url,
    cancel_url: req.body.cancel_url,
    automatic_tax: {enabled: true},

  });
  

  return res.status(200).json({link:session.url});
  

  //
  let log = {
    items:items,
    stripeObjects:stripeObjects, 
    orderProducts:orderProducts,
    stripePrices:stripePrices,
    line_items:line_items,
    sessions:sessions
  }

  return res.status(200).json(log);


  //return res.status(200)
  




});

app.post('/checkout', cors(), verifyToken, async (req, res)=>{

  //console.log("req:----", req)
  console.log("body->", req.body)

  let body = req.body
  let items = req.body.items

  let stripeObjects = {
    bracelets:{
      product:null,
      prices:[]
    },
    necklaces:{
      product:null,
      prices:[]
    },
    earrings:{
      product:null,
      prices:[]
    },
    keyrings:{
      product:null,
      prices:[]
    },

  }

  // Get products and prices
  let stripeProducts = await stripe.products.list({
    active:true,
    limit:100
  });

  
  for(let item of stripeProducts.data){
    if(item.metadata['category'] && item.metadata['category'] != "shipping"){
      stripeObjects[item.metadata['category']].product = item

    }

  }

  /*
  let stripePrices = await stripe.prices.list({
    active:true,
    limit:100
  });
  */

  let orderProducts = []
  for(let item of items){
    
    let foundProduct = stripeObjects[item.category].product

    orderProducts.push(
      {
        id:foundProduct.id,
        price:item.price*100
      }
      
    )

  }

  // Add line_items
  let line_items = []
  for(let item of orderProducts){
    
    let cPrice = {
      currency: 'sek',
      unit_amount: item.price,
      product: item.id
    }

    let order_item = {
      price_data: cPrice,
      quantity: 1,
    }

    line_items.push(order_item)
    
  }

  // Add shipping
  let shipping = {
    currency: 'sek',
    unit_amount: 1900,
    product: "shipping_bb14879f-3d6e-4230-a8a8-e5df34508777"

  }
  let shipping_item = {
    price_data: shipping,
    quantity: 1,
  }
  line_items.push(shipping_item)
  
  const session = await stripe.checkout.sessions.create({
    customer_email:body.email,
    line_items: line_items,
    mode: 'payment',
    success_url: req.body.success_url, 
    cancel_url: req.body.cancel_url,
    automatic_tax: {enabled: true},

  });

  return res.status(200).json({link:session.url});
  

  //
  let log = {
    items:items,
    stripeObjects:stripeObjects, 
    orderProducts:orderProducts,
    stripePrices:stripePrices,
    line_items:line_items,
    sessions:sessions
  }

  return res.status(200).json(log);


  //return res.status(200)
  




});

// Email
app.post('/send-email', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      type: "OAUTH2",
      user: process.env.GMAIL_USERNAME,  //set these in your .env file
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: process.env.OAUTH_ACCESS_TOKEN,
      expires: 3599
    }
  });

  const mailOptions = {
    from: env.EMAIL,
    to: email, // Replace with recipient email address
    subject: 'New Contact Form Submission',
    text: `
      Name: ${name}
      Message: ${message}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');

    }
    else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');

    }

  });

});

// Misc
app.get('/wake-up', cors(), verifyToken, async (req, res)=>{

  //console.log("req:----", req)
  console.log("body->", req.body)

 
  try{
   

  }
  catch{
   
  }

  

  return res.status(200).json({status:"woke up!"});
  
  
});

// Init
app.listen(4242, () => console.log('Running on port 4242'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})