require("dotenv").config();
const path = require("path")
const db = require("./config/database")
const express = require("express");
const exp = require("constants");

const app = express();

//set this value globally in our application
app.set("view engine", "ejs");
app.set("views", "views");

//use bodyParser to grab the body sent via nodejs
app.use(express.urlencoded({extended:false}));

//This is use to statically generate files in the public and images folder using the path declared
app.use(express.static(path.join(__dirname, "public")));
app.use("/images",express.static(path.join(__dirname, "images")));

app.get("/",(req, res)=>{

    db.searchByValue(
        {
        operation:"search_by_value",
        schema:"book",
        table:"record",
        searchValue:"*",
        searchAttribute:"record_id",
        attributes:["*"]

    },
    (err, response)=>{
        if (err) {
            return res.status(500).json(err);
        }
        res.render("index",{
            pageTitle:"Home | LMS ",
            records:response.data
        });
    }
    )
})

//add new book
app.post("/book/add",(req, res)=>{
    // Get the user data from the request
    const {isbn,title,author,description,publisher} = req.body

    // Insert a new record into the database
    db.insert(
        {
          operation:"insert",
          schema:"book",
          table:"record",
          records:[{
            isbn,title,author,description,publisher
          }]
        },
        (err, response)=>{
            if (err) {
                return res.status(500).json(err);
              }
        // After creating a new record successfully, redirect back to homepage
              res.redirect(302, "/");
        }
    )
})

// Updating a record
app.post("/book/edit",(req, res)=>{
    const {record_id,isbn,title,author,description,publisher} = req.body
    db.update(
        {
            operation:"update",
            schema:"book",
            table:"record",
            records:[{
                record_id,isbn,title,author,description,publisher
              }]
        },
        (err, response)=>{
            if(err){
                res.status(500).json(err)
            }
            // After updating successfully, kindly redirect back to homepage
            res.redirect(302,"/")
        }
    )

})

// Delete action
app.post("/book/delete/:record_id",(req,res)=>{
    const {record_id}= req.params
db.delete(
    {
        operation:"delete",
        schema:"book",
        table:"record",
        hashValues:[record_id]
    },

    (err, response)=>{
        if(err){
            return res.status(500).json(err)
        }
        res.redirect(302,"/")
    }
)
})

module.exports = app