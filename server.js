require('dotenv').config()
//const env = require('./src/environment/environment');
const env = process.env;

// This is your test secret API key.
const stripe = require('stripe')("sk_test_51Owtf1065nngbryAiEp1d2oa0VifQpOyKngvHNREZIoTEM11oPaJH5tnvwZFNp4Euqn583KqwmOAMKXAjxgsNFBa00p0w2eNsq");

// CRYPTO //
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJwt = require('passport-jwt')
const bcrypt = require('bcrypt');

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
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
  
});

// HTTP //
const http = require('http');
const server = http.createServer(app);

const YOUR_DOMAIN = env.DOMAIN + ":" + env.PORT;

// SÄKERHET/HASH PASSWORD //
async function hash(data) {
  const hash = crypto.createHash('sha256');
  hash.update(data);

  return bcrypt.hash(data, 10);

  const sd = bcrypt.hashSync(myPlaintextPassword, saltRounds);


  return hash.digest('hex');


}


app.get('/access', verifyToken, async (req, res) => {
  console.log("id->", req.query.password)

  //var token = jwt.sign({ foo: 'bar' }, req.query.password);
  //var token2 = jwt.sign({ foo: 'bar' }, req.query.password, { algorithm: 'RS256' });


  let msg = { 
    message: 'Access granted',
    input:req.query.password,
    

  }

  res.json(msg);

});


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

// Products
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

function createPrice(product) {
  
}

// Checkout
app.post('/checkout', cors(), verifyToken, async (req, res)=>{

  //console.log("req:----", req)
  console.log("body->", req.body)

  let items = req.body.items
  let products = []
  let line_items = []

  for (const item of items) {
    try{
      let product = await stripe.products.retrieve(item.uid);
      products.push(product)
      
    
      if(product.default_price){
        line_items.push(
          {
            price:product.default_price,
            quantity:1
          }
        )
      }


    }
    catch{
      //return res.status(404).json({ error: 'Kan inte hitta product' });
      /*
      return res.status(200).json(
        { 
          msg: 'Checkout', 
          items:req.body.items, 
          address:req.body.address,
          products:products,
        });
        */
    }
    
  }

  let data =  { 
    msg: 'Checkout', 
    items:req.body.items, 
    address:req.body.address,
    products:products,
    line_items:line_items,
  }

  //return res.status(200).json(data);
  
  const session = await stripe.checkout.sessions.create({
    customer_email:req.body.address.email,
    line_items: line_items,
    mode: 'payment',
    success_url:  env.DOMAIN + "/checkout/success",
    cancel_url: env.DOMAIN + "/checkout/failure",
    automatic_tax: {enabled: true},
  });


  return res.status(200).json({link:session.url});
  
   res.redirect(303, session.url);
  
  
 
   return res.status(200).json(
    { 
      msg: 'Checkout', 
      items:req.body.items, 
      address:req.body.address,
      products:products,
    });
});

// Misc

// Init
app.listen(4242, () => console.log('Running on port 4242'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})