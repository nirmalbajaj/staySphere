const express = require('express')
const storeRouter = express.Router()
const { getHomes, getBookings, getIndex, getFavoriteList, getHomeDetails, postAddToFavorite, postRemoveFromFavorite } = require('../controllers/storeController')

storeRouter.get("/", getIndex)
storeRouter.get("/bookings", getBookings)
storeRouter.get("/homes", getHomes)
storeRouter.get("/favorites", getFavoriteList)
storeRouter.get("/homes/:homeId", getHomeDetails)
storeRouter.post("/favorites", postAddToFavorite)
storeRouter.post("/favorite/delete/:homeId", postRemoveFromFavorite)



module.exports = storeRouter