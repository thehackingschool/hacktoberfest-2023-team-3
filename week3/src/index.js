 const express = require('express');
 const path = require("path");
 const bcrypt = require("bcrypt");
 const collection = require("./config");

 const app = express();

 app.use(express.json());

 app.use(express.urlencoded({extended: false}));

 app.set('view engine','ejs');

 app.use(express.static("public"));

 app.get("/login", (req, res) => {
    res.render("login");
 });

 app.get("/signup",(req, res) => {
    res.render("signup");
 });

 app.post("/signup", async(req,res) => {

//    const data ={
//       name: req.body.username,
//       password: req.body.password
//    }

//    const existingUser = await collection.findOne({name:data.name});
//    if(existingUser){
//       res.send("User already exists. Please choose a different username.");

//    }else{
//       const saltRounds = 10;
//       const hashedPassword = await bcrypt.hash(data.password, saltRounds);

// data.password = hashedPassword;

//       const userdata = await collection.insertMany(data);
//       console.log(userdata);
//    }

const data = {
   name: req.body.username,
   email: req.body.email,
   password: req.body.password,
   confirmPassword: req.body.confirmPassword
 };
 
 // Check if the password and confirmPassword match
 if (data.password !== data.confirmPassword) {
   res.send("Passwords do not match. Please try again.");
 } else {
   const existingUser = await collection.findOne({ name: data.name });
 
   if (existingUser) {
     res.send("User already exists. Please choose a different username.");
   } else {
     const saltRounds = 10;
     const hashedPassword = await bcrypt.hash(data.password, saltRounds);
     data.password = hashedPassword;
 
     // Now, you can insert the user data into the collection
     const result = await collection.insertMany({
       name: data.name,
       email: data.email,
       password: data.password
     });
 
     console.log("User data inserted:", data,req.body);
     res.render("login");
   }
 }
 
  
 });

 //login user
 app.post("/login",async(req, res) => {
 try{
   const check = await collection.findOne({name:req.body.username});
   if(!check){
      res.send("user name cannot be found");
   }

   //compare the hash password from database with plain text
   const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
   if(isPasswordMatch){
      res.redirect("/");
   }else{
      req.send("wrong password");
   }

 }catch{
   res.send("wrong details");

 }
 });
 
 let shoppingCart = [];
 app.post('/add-to-cart', (req, res) => {
   const { itemId, itemName, price } = req.body;
 
   if (!itemId || !itemName || !price) {
     return res.status(400).json({ message: 'Invalid item data' });
   }
 
   shoppingCart.push({ itemId, itemName, price });
   res.status(201).json({ message: 'Item added to the cart' });
 });
 
 
 app.delete('/remove-from-cart/:itemId', (req, res) => {
   const itemId = req.params.itemId;
 
 
   const itemIndex = shoppingCart.findIndex((item) => item.itemId === itemId);
 
   if (itemIndex === -1) {
     return res.status(404).json({ message: 'Item not found in the cart' });
   }
 
 
   shoppingCart.splice(itemIndex, 1);
   res.json({ message: 'Item removed from the cart' });
 });
 
 




 const port = 5000;
 app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
 })
