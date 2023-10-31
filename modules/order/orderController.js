const carts = require("../../models/cartModel");
const orders = require("../../models/orderModel");
const users = require("../../models/userModel");

const express = require('express');
const nodemailer = require('nodemailer');
const mjml2html = require('mjml');
const fs = require('fs');
const path = require('path')

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'colleen.legros66@ethereal.email',
        pass: 'qRa2YJmeXyawUfjauD'
    }
});

exports.checkout = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cartToAdd = await carts.findById(cartId);
    if (cartToAdd.price >= 200) {
      const orderToAdd = {
        cartId,
        userId: cartToAdd.userId,
        items: cartToAdd.items,
        price: cartToAdd.price,
      };
      await carts.findByIdAndRemove(cartId);
      const added = await orders.create(orderToAdd);

      const mjmlTemplate = fs.readFileSync(path.resolve(__dirname,"../../helper/invoice.mjml"), "utf-8");
      const mjmlData = mjmlTemplate
        .replace("{{cartId}}", orderToAdd.cartId)
        .replace("{{price}}", orderToAdd.price);

      const { html } = mjml2html(mjmlData);

      const mailOptions = {
        from: "uniqkrimson100@gmail.com",
        to: "krishnachaudhary8452@gmail.com", 
        subject: "Invoice for your recent purchase",
        html: html,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      res.json({ added, success: "cart checkout successfully" });
    } else {
      res
        .status(400)
        .json({
          message:
            "There must  be minimum price of Rs 200 in shopping cart to checkout!!!!!",
        });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to checkout the cart item" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const allOrderedData = await orders
      .find({})
      .populate("userId")
      .populate("items.productId");
    res
      .status(200)
      .json({ allOrderedData, success: "all orderd data are listed above" });
  } catch (error) {
    res.status(500).json({ error: "failed to listout all orders" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderDataById = await orders.findById(orderId);
    if (orderDataById) {
      res
        .status(200)
        .json({ orderDataById, success: " order data by id found" });
    } else {
      res.status(404).json({ message: "order not found in the list" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to get order" });
  }
};

exports.deleteOrderById = async (req, res) => {
  try {
    const deleteId = req.params.id;
    const deletedOrder = await orders.findByIdAndRemove(deleteId);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
