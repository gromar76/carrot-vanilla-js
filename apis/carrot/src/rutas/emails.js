const nodemailer = require("nodemailer");
const express = require("express");

const router = express.Router();

router.post("/enviar", (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nicogrons@gmail.com",
      pass: "bgypokwwhjpcooon",
    },
  });

  transporter.sendMail(
    {
      from: "info@carrotsports.com",
      to: "nicogrons@gmail.com",
      subject: "Probsantdoock ff",
      text: "Hola!!!!",
    },
    (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ mensaje: "error" });
      } else {
        console.log("Salio bien...", info);
        res.json({ mensaje: "OK" });
      }
    }
  );
});

module.exports = router;
