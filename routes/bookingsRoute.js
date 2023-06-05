const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingsModel");
const Bus = require("../models/busModel");
const stripe = require("stripe")(process.env.stripe_key);
const { v4: uuidv4 } = require("uuid");


router.post("/book-seat", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      transactionId: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000,
      user: req.body.userId,
      harga: req.body.harga
    });
    await newBooking.save();
    const bus = await Bus.findById(req.body.bus);
    bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];
    await bus.save();
    res.status(200).send({
      message: "Booking Berhasil!!",
      data: newBooking,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Booking Gagal!!",
      data: error,
      success: false,
    });
  }
});



/*router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: amount,
        currency: "idr",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      res.status(200).send({
        message: "Pembayaran Berhasil!!",
        data: {
          transactionId: payment.source.id,
        },
        success: true,
      });
    } else {
      res.status(500).send({
        message: "Pembayaran Gagal!!",
        data: error,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Payment failed",
      data: error,
      success: false,
    });
  }
});*/


router.post("/get-bookings-by-user-id", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId, dibayar: "true" })
      .populate("bus")
      .populate("user");
    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
});

router.post("/get-update-payment-status", authMiddleware, async (req, res) => {
  try {
    await Booking.findOneAndUpdate({transactionId: req.body.transactionId}, {dibayar: "true"})
    res.send({
      message: req.body.transactionId,
      success: true,
      data: null,
    });
  } catch (error) {
    res.send({
      message: req.body,
      success: false,
      data: null,
    });
  }
});


router.post("/get-bookings-by-payment-status", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId, dibayar: "false" })
      .populate("bus")
      .populate("user");
    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
});


router.post("/get-all-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("bus").populate("user");
    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
});
    



module.exports = router;
