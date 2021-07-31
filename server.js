const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const dotenv = require('dotenv')
const Email = require("email-templates");

const app = express();

// env configuration
dotenv.config();

//View Engine Setup
app.engine("handlebars", exphbs({ defaultLayout: false }));
app.set("view engine", "handlebars");

//body parser middleware
//For < Express 4.16
// app.use(bodyParser.urlencoded({extended:false}))
// app.use(bodyParser.json())

//For > 4.17
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Public Folder
app.use("/public", express.static(path.join(__dirname + "/public"))); //Works

const transporter = new Email({
  message: {
    from: "test@mailtrip-demo.com",
  },
  send: true,
  transport: {
    host: "smtp.mailtrap.io",
    port: 2525,
    ssl: false,
    tls: true,
    auth: {
      user: process.env.MAILTRIP_USER,
      pass: process.env.MAILTRIP_PASS
    }
  },
});

// Index Route
app.get("/", (req, res) => {
  res.render("contact");
});

// Form submission endpoint
app.post("/send", (req, res) => {
  console.log(req.body);

  const { email, name, company, phone, message } = req.body;

  // create locals
  const person = { name, company }

  // send an asynchronous email here...
  transporter
    .send({
      message: {
        to: email,
      },
      template: "welcome",
      locals: person,
    })
    .then(console.log)
    .catch(console.error);

  return res.json({
    msg: "Please check your mailbox !",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
