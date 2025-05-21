const path = require('path')
const express = require('express')
const multer = require('multer')
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

const randomString = (length) => {
  const characters= 'abcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < length; i++) {
    result+=characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  }else {
    cb(null, false)
  }
}

const multerOptions = { storage, fileFilter }

app.use(express.urlencoded({extended: false}))
app.use(multer(multerOptions).single('photo'))
app.use(express.static(path.join(rootDir, 'public')))
app.use("/uploads", express.static(path.join(rootDir, 'uploads')))
app.use("/host/uploads", express.static(path.join(rootDir, 'uploads')))
app.use("/homes/uploads", express.static(path.join(rootDir, 'uploads')))

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