
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());


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


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});