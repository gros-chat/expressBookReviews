const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
// const secretKey = 'secretKeyAccess';
const secretKey = require('./secretKey.js');

let users = [ {
  "user": "abc123",
  "pwd": "abc123"
}];

const isValid = (username)=>{ 
//returns boolean
//write code to check is the username is valid
const filteredUsers = users.filter(users => users.user === username);
// console.log("here is the filteredUsers " + filteredUsers)
if (filteredUsers.length > 0) {
  console.log("user exist")
  return true;
} else {
  console.log("user does not exist here are the users")
  console.log(users)
  console.log("the user name is " + username)
  return false;
}
}

const authenticatedUser = (username,password)=>{ 

if (isValid(username)){
    //retrieve pwd in users[]
    const passwordDb = users.find(item => item.user === username);
   console.log("here is the pwd " + passwordDb.pwd)

    // if(users[username].pwd ===password)
    if(passwordDb.pwd==password)
    {return true;}
  else{
    console.log("pwd is wrong")
    return false;}
  }
   else{
    return false;}
}


//verify cookie
const verify = (req, res, next) =>{
let zeToken = req.headers.authorization.split(" ")[1];
  console.log("hey")

  jwt.verify(zeToken,secretKey, (err, user)=>{
    if(err){
      console.log("token not valid weird")
      console.log(zeToken)
      return res.status(403).json("Token not valid");
    }
    else {
      req.user = user;
      console.log("valid token")
      next();
    }
  })
}
//only registered users can login
regd_users.post("/login", (req,res) => {

  
  const user = req.body.user;
  const pwd = req.body.password;
  console.log("so far so good");
    if (!user) {
        return res.status(404).json({message: "Body Empty"});
    }
  
    if(authenticatedUser(user, pwd)){
      let accessToken = jwt.sign({
        data: user
      }, secretKey, { expiresIn: 60 * 60 });

      req.session.authorization = {
        accessToken
    }
    return res.status(200).send("here is the access token: " +accessToken);
  }

else{
  //user not authenticated
  return res.status(300).json({message: "user not authenticated"});
}
});


// Add a book review
regd_users.put("/auth/review/:isbn",(req, res) => {
  //Write your code here
  const autHeader = req.headers.authorization;
  let userN = JSON.stringify(req.user);
  const username = JSON.parse(userN)
  const leUser = username.data;
  const laReview = req.params.review;
  console.log("hello review " + username.data)
  const isbn = req.params.isbn

  if(autHeader){
    console.log("autHeader stage is passed")
    const filteredBooks = Object.values(books).filter(book => book.isbn === isbn);
    console.log("hopefully the user name" +JSON.stringify(filteredBooks[0].reviews[leUser]))
    if (JSON.stringify(filteredBooks[0].reviews[username.data])){
      //user has already reviewed the book -> replace with new review
      filteredBooks[0].reviews[username.data] = laReview;
      return res.status(300).json({message: "review updated"})

    }else{
      //the user has not reviewd the book yet
      filteredBooks[0].reviews={leUser:laReview};
      return res.status(300).json({message: "new review added"})

    }
   
    
  }else{
    console.log("need login")
    return res.redirect("/login");

  }
  
});

// Delete a book review
regd_users.put("/auth/deletereview/:isbn", (req, res) => {
  //Write your code here
  const autHeader = req.headers.authorization;
  let userN = JSON.stringify(req.user);
  const username = JSON.parse(userN)
  const leUser = username.data;
  const laReview = req.params.review;
  
  const isbn = req.params.isbn

  if(autHeader){
    const filteredBooks = Object.values(books).filter(book => book.isbn === isbn);
    if (JSON.stringify(filteredBooks[0].reviews[username.data])){
      //user has already reviewed the book -> delete review
      filteredBooks[0].reviews[username.data] = "";
      return res.status(300).json({message: "review deleted"})

    }else{
      //the user has not reviewd the book yet
      filteredBooks[0].reviews={leUser:laReview};
      return res.status(300).json({message: "you have not review this book yet"})

    }  
      
  }else{
    console.log("need login")
    return res.redirect("/login");
  }  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
