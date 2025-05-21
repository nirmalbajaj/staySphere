const path = require('path')
const express = require('express')
const storeRouter = require('./routes/storeRouter')
const {hostRouter} = require('./routes/hostRouter')
const rootDir = require('./Utils/pathUtils')
const { pageNotFound } = require('./controllers/error')
const { default: mongoose } = require('mongoose')
const authRouter = require('./routes/authRouter')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const DB_PATH = "mongodb+srv://root:root@airbnbnodejs.vxqihyg.mongodb.net/airbnb?retryWrites=true&w=majority&appName=airbnbNodejs"


const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

// IMPORTANT: Body parser middleware moved BEFORE session and routes
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(rootDir, 'public')))

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions'
})

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  store
}))

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn
  next()
})

app.use(storeRouter)
app.use("/host", (req, res, next) => {
  if(req.isLoggedIn) {
    next()
  } else {
    res.redirect("/login")
  }
})
app.use("/host", hostRouter)
app.use(authRouter)
app.use(pageNotFound)

const PORT = 3003
mongoose.connect(DB_PATH).then(() => {
  console.log("Connected to Mongo")
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  })
}).catch(error => {
  console.log("Error while connecting to Mongo: ", error)
})