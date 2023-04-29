const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const { render } = require("ejs");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static("public"))
const port = 3000;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/taskDB");

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please type the task!!!!!!!"]
    }
});
const Task = mongoose.model("Task", taskSchema)
const reading = new Task({
    name: "Reading Books"
});
const coding = new Task({
    name: "Coding Challenge"
});
const exercise = new Task({
    name: "Physical Exercise"
});
const listSchema = new mongoose.Schema({
    name: String,
    items: [taskSchema]
});
const List = mongoose.model("List", listSchema);

// let items = ["Reading Books", "Coding Challenge", "Physical Exercise", "Mental Exercise"];
let work = [];
app.get("/", function (req, res) {
    // res.sendFile(__dirname + "/index.html");
    
    // if (currentDay === 0 || currentDay === 6) {
    //     let day = "Weekend"
    // } else {
    //     let day = weekDays[currentDay]   
    // }
    const day = date.getDay();
    Task.find({}, function (err, tasks) { 
        if (tasks.length === 0) {
            Task.insertMany([reading, coding, exercise],function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully added...");
                }
            });
        res.redirect("/");
        } else { 
            res.render("list", {listName: "Today", newItem: tasks});
        }
    });
});
app.post("/", function (req, res) {
    const item = req.body.itemName;
    const currentList = req.body.list;
    if (item !== ""){
        const newItem = new Task({
            name: item
        });
        if (currentList === "Today"){
            newItem.save();
            res.redirect("/");
        }else{
            List.findOne({name: currentList}, function (err, existingList) {
                if (!err){
                    existingList.items.push(newItem);
                    existingList.save();
                    res.redirect("/"+ currentList);
                }
            });
        }
    };
})
app.post("/delete", function (req, res) {
    const activityId = req.body.box;
    const listType = req.body.itemList;
    if (listType === "Today"){
        Task.findByIdAndRemove(activityId, function (err) {
            if (err){
                console.log(err);
            }else{
                console.log("Successfully deleted");
            }
            res.redirect("/");
        });
    }else{
        List.findOneAndUpdate({name: listType}, {$pull: {items: {_id: activityId}}}, function (err, foundList){
            if (!err){
                console.log("Deleted Successfully..");
            }else{
                console.log(err)
            }
            res.redirect("/"+ listType);
        });
    }
});

app.get("/:paramName", function (req, res) {
   const customList = _.capitalize(req.params.paramName);

   List.findOne({ name: customList }, function (err, result) {
    if (!result){

        const list = new List({
             name: customList,
             items: []
        });
        list.save();
        res.redirect("/" + customList)
    }else{
        res.render("list",{ listName: result.name, newItem: result.items})
    }
   });
});
app.get("/about", function (req, res) {
    res.render("about")
})

app.listen(port, function () {
    console.log("Server is Running..");
})

