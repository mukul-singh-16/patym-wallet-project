const express = require('express');
const router = express.Router();
const { authrization } = require('../middleware');
const { Account } = require("../db");
const { default: mongoose } = require('mongoose');





router.get("/balance", authrization, async (req, res) => {

    // console.log("get balance")
    const account = await Account.findOne({
        userId: req.userId
    });
    res.json({
        balance: account.balance
    })
});


router.post("/transfer", authrization, async (req, res) => {
    try {
        const { amount, to } = req.body;

        // Fetch the sender's account
        const account = await Account.findOne({ userId: req.userId });
        if (!account || account.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Fetch the recipient's account
        const toAccount = await Account.findOne({ userId: to });
        if (!toAccount) {
            return res.status(400).json({ message: "Invalid account" });
        }

        // console.log("my accont " + account.balance)
        // console.log("to accont " + toAccount.balance)
        // Perform the transfer
        account.balance -= amount;
        toAccount.balance = parseInt(toAccount.balance)+parseInt(amount);

        // console.log("my accont " + account.balance)
        // console.log("to accont " + toAccount.balance)
        // console.log("to accont " + toAccount.balance+amount)


        await account.save();
        await toAccount.save();

        return res.status(200).json({ message: "Transfer successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});






    module.exports = router