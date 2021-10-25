// dependencies
require("dotenv").config();
const { DATABASE_URL, PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");


const { application } = require("express");
const express = require("express");

// initialize express 
const app = express();

// configure Application settings


//connect to mongoDB
// require mongoose 
// Establish Connection
mongoose.connect(DATABASE_URL);
// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to MongoDB"))
.on("close", () => console.log("You are disconnected from MongoDB"))
.on("error", (error) => console.log(error));


const Schema = mongoose.Schema;
const PeopleSchema = new Schema({
    name: String,
    image: String,
    title: String
}, { timestamps: true });

const People = mongoose.model("People", PeopleSchema);

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());



// routes
app.get("/", (req, res) => {
    res.send("Hello World")
});

//people index route
app.get("/people", async (req, res) => {
    try {
        res.json(await People.find({}));
        // const people = await People.find({});
        // res.json(people);
    } catch (error) {
        //send error
        res.status(400).json(error)
    }
});

// people delete route
app.delete("/people/:id", async (req, res) => {
    try {
        // send all people
        res.json(await People.findByIdAndDelete(req.params.id));
    } catch (error) {
        // send error
        res.status(400).json(error)
    }
});

// people update route
app.put("/people:id", async (req, res) => {
    try {
        // send all people
        res.json(
        await People.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true })
        );
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
})

// people create route
app.post("/people", async (req, res) => {
    try {
      // send all people
      res.json(await People.create(req.body));
        // const person = await People.create(req.body);
        // res.jason(person);
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });



// listener
app.listen(PORT, () => {
    console.log(`You are now listening to the smooth sounds of typing on port: ${PORT}`);
});
