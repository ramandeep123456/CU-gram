require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const morgan = require("morgan")
const cookieparser = require("cookie-parser")
const cors = require("cors")

const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT || 5000

// middlewares

app.use(morgan("dev"))
app.use(cors())
app.use(cookieparser())
app.use(express.json())
// routes

app.use("/api/v1", require("./routes/auth.route"))
app.use("/api/v1", require("./routes/user.route"))

app.get("/", (req, res) => {
  res.send("this is the home")
})

// database connectivity
mongoose.connect(
  MONGO_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, response) => {
    if (err) {
      console.log(err)
    }
    console.log("MongoDB connected successfully")

    // listen to server
    app.listen(PORT, () => {
      console.log(`Server started at ${PORT}`)
    })
  }
)
