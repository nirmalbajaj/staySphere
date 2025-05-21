const Home = require('../models/home')
const User = require('../models/user')

exports.getHomes = (req, res, next) => {
    Home.find().then(registeredHomes => {
        res.render("store/home-list", {
          registeredHomes: registeredHomes,
          pageTitle: "Homes List",
          currentPage: "Home",
          isLoggedIn: req.isLoggedIn,
          user: req.session.user,
        });
    })    
}

exports.getIndex = (req, res, next) => {
    Home.find().then(registeredHomes => {
       res.render("store/index", {
         registeredHomes: registeredHomes,
         pageTitle: "airbnb Home",
         currentPage: "index",
         isLoggedIn: req.isLoggedIn,
         user: req.session.user,
       });
    })    
}

exports.getBookings = (req, res, next) => {
    res.render("store/bookings", {
      pageTitle: "My Bookings",
      currentPage: "bookings",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
}   

exports.getFavoriteList = async (req, res, next) => {
    const userId = req.session.user._id
    const user = await User.findById(userId).populate('favorites')
    res.render("store/favorite-list", {
      favoriteHomes: user.favorites,
      pageTitle: "My Favorites",
      currentPage: "favorites",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
};

exports.postAddToFavorite = async (req, res, next) => {
    const homeId = req.body.id
    const userId = req.session.user._id
    const user = await User.findById(userId)
    if (!user.favorites.includes(homeId)){
        user.favorites.push(homeId)
        await user.save()
    }
    res.redirect("/favorites")
}

exports.postRemoveFromFavorite = async (req, res, next) => {
    const homeId = req.params.homeId
    const userId = req.session.user._id
    const user = await User.findById(userId)
    if(user.favorites.includes(homeId)) {
        user.favorites = user.favorites.filter(fav => fav != homeId)
        await user.save()
    }
    res.redirect("/favorites")
}

exports.getHomeDetails = (req, res, next) => {
    const homeId = req.params.homeId 
    Home.findById(homeId).then(home => {
        if(!home){
            console.log("Home not found")
            res.redirect("/homes")
        }else {
         res.render('store/home-detail',
            {   
                home: home,
                pageTitle: "Home Detail",
                currentPage: "Home",
                isLoggedIn: req.isLoggedIn,
                user: req.session.user,
            }
        )}
    })
}