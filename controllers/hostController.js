const Home = require('../models/home')
const fs = require('fs')

exports.getAddHome = (req, res, next) => {
     res.render("host/edit-home", {
        pageTitle: "Add Home to Airbnb",
        currentPage: "addHome",
        editing: false,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
}

exports.getEditHome = (req, res, next) => {

   const homeId = req.params.homeId
   const editing = req.query.editing === 'true'

   Home.findById(homeId).then(home => {
     if (!home) {
       console.log("Home not found");
       return res.redirect("/host/host-home-list");
     }

     console.log(homeId, editing, home);
     res.render("host/edit-home", {
       home: home,
       pageTitle: "Edit Home Details",
       currentPage: "host-Home",
       editing: editing,
       isLoggedIn: req.isLoggedIn,
       user: req.session.user,
     });
   });

}

exports.getHostHomes = (req, res, next) => {

   Home.find().then(registeredHomes => {
       res.render("host/host-home-list", {
         registeredHomes: registeredHomes,
         pageTitle: "Host Homes List",
         currentPage: "host-Home",
         isLoggedIn: req.isLoggedIn,
         user: req.session.user,
       });
   })    
}

exports.postAddHome = (req, res, next) => {
    const { houseName, price, location, rating, description } = req.body
    console.log(houseName, price, location, description)
    console.log(req.file)
    if(!req.file) {
      return res.status(422).send("No image provided")
    }
    const photo = req.file.path
    const home = new Home({houseName, price, location, rating, photo, description})
    home.save().then(() => {
      console.log("Home Saved Successfully")
    })
    res.redirect("/host/host-home-list");
}

exports.postEditHome = (req, res, next) => {
   const {id, houseName, price, location, rating, description} = req.body
   Home.findById(id).then((home) => {
      home.houseName = houseName
      home.price = price
      home.location = location
      home.rating = rating
      home.description = description

      if(req.file) {
         fs.unlink(home.photo, (err) => {
            if(err) {
               console.log("Error while deleting file: ", err)
            }
         })
         home.photo = req.file.path
      }

      home.save().then((result) => {
      console.log("Home Updated", result)
   }).catch(error => {
      console.log("Error while updating", error)
   })
   res.redirect("/host/host-home-list");
   }).catch(error => {
      console.log("Error while founding home", error)
   })
}

exports.postDeleteHome = (req, res, next) => {

   const homeId = req.params.homeId
   console.log("came to delete", homeId)
   Home.findByIdAndDelete(homeId).then(() => {
      res.redirect("/host/host-home-list");
   }).catch(error => {
      console.log("Error occurred while deleting: ", error)
   })
}

