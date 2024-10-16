const { MailtrapClient } = require("mailtrap");
const dotenv = require("dotenv");

dotenv.config();

const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};

module.exports = { client, sender }