const port = 3000;
const express = require("express");
const { default: mongoose } = require("mongoose");

const app = express();
app.use(express.json());

const connectDB = async() =>{
  const connect = mongoose.connect('mongodb+srv://krishnachaudhary8452:dinesh84@cluster0.r3ayoc1.mongodb.net/?retryWrites=true&w=majority')
  await connect.then(
    (db)=>{
      console.log('moongoose connected successfylly')
    },
    (err) =>{
      console.log('failed to connect the mongoose')
  })
}

connectDB();

const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const cartRouter = require("./routes/cartRouter")
// const orderRouter = require("./routes/orderRouter");

app.use("/users", userRouter);
app.use("/products", productRouter);
// app.use("/orders", orderRouter);
app.use("/carts", cartRouter)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
