const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.auz3f9x.mongodb.net/user`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/pages/index.html'); 
});


app.post('/register', async(req, res) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });

      await user.save();
      res.redirect("/success");
    } else {
      console.log("user already exists");
      res.redirect("/error");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + '/pages/success.html'); 
});

app.get("/error", (req, res) => {
  res.sendFile(__dirname + '/pages/error.html'); 
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});