

let stripeObjects = {
    bracelets:{
      product:null,
      prices:[]
    }
    
  }

// OLD CHECKOUT
/*
app.post('/checkout', cors(), verifyToken, async (req, res)=>{

  //console.log("req:----", req)
  console.log("body->", req.body)

  let items = req.body.items
  let products = []
  let line_items = []

  const stripeProducts = await stripe.products.list({
  });

  const stripePrices = await stripe.prices.list({
  });

  for (const prod of products.data) {
    //await stripe.products.del(prod.id);

    
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
    success_url: req.body.success_url,
    cancel_url: req.body.cancel_url,
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


*/

  /*

    // Expire all sessions
  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
  });

  for(let ses of sessions.data){
    if(ses.status == "open"){
      await stripe.checkout.sessions.expire(ses.id);
    }
    
  }

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



  */


/*

  for(let item of items){
    let productSearch = await stripe.products.search({
      limit:100,
      query: 'active:\'true\' AND metadata[\'category\']:\''+ item.category +'\'',
    });
    console.log("productSearch", productSearch)

    if(productSearch.data.length > 0){
      products.push(productSearch.data[0])

    }
    
    let pricesSearch = await stripe.prices.search({
      limit:100,
      query: 'metadata[\'category\']:\' '+item.category+' \'',
    });
    console.log("pricesSearch", pricesSearch)

    if(pricesSearch.data.length > 0){
      prices.push(pricesSearch.data[0])

    }

  }


*/

// UPDATE PRICES
/*

  const sPrices = await stripe.prices.list({
    active:true,
    limit:100
  });

  for (const pri of sPrices.data) {
    
    const price = await stripe.prices.update(
      pri.id,
      {
        metadata: {
          price:pri.unit_amount,
        },
      }
    );
    
  }


*/

/*
  let productSearch = await stripe.products.search({
    limit:100,
    query: 'active:\'true\' AND metadata[\'category\']:\'bracelets\'',
  });
  */
  
  //const result = prices.groupBy(prices, ({ metadata }) => metadata);
  /*
  const braceletPrices = await stripe.prices.search({
    limit:100,
    query: 'active:\'true\' AND metadata[\'category\']:\'bracelets\'',
  })*/

  /*
  const pricesSearch = await stripe.prices.search({
    limit:100,
    query: 'product:\'bracelets_7def2637-03cc-4b63-9c75-974d3e438e9f\'',
  });
  
  for (const pri of pricesSearch.data) {
    
    const price = await stripe.prices.update(
      pri.id,
      {
        metadata: {
          category:"bracelets",
        },
      }
    );
    
  }
  */


  
  /*
  const stripeProducts = await stripe.products.list({
    active:true,
    limit:100
  });

  let products = []
  let line_items = []
  for (const prod of stripeProducts.data) {
    
    products.push(prod)
    
  }

  const stripePrices = await stripe.prices.list({
    active:true,
    limit:100
  });
  let prices = []
  for (const pri of stripePrices.data) {
    
    prices.push(pri)
    
  }
  */

  function createPrice(product) {
  
  }
  
  async function createBaseProduct(body){
  
    let uuid = uuidV5();
  
    let data = {
      id: body.category + "_" + uuid,
      name: body.title,
      description: "",
      active: true,
      metadata:{category: body.category},
      //default_price:null
    }
  
    console.log(data)
  
    try{
      let product = await stripe.products.create(data);
      console.log("product", product)
  
      return product
      /*
      let counter = [ 5, 10, 15 ]
      for (const price of counter) {
        
        const priceCreate = await stripe.prices.create({
          currency: 'sek',
          unit_amount: price*100,
          product: uuid
        });
        console.log("priceCreate", priceCreate)
      }
      */
  
    }
    catch{
  
    }
  
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


  async function hash(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
  
    return bcrypt.hash(data, 10);
  
    const sd = bcrypt.hashSync(myPlaintextPassword, saltRounds);
  
  
    return hash.digest('hex');
  
  
  }
  