const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//models
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

// mongoose.set("useFindAndModify", false);

mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => {
        console.log("Connected to db!");
        app.listen(3000, () => console.log("Server Up and running"));
    })
    .catch((error) => {
        console.log(error);
    }); 

// view engine configuration
app.set("view engine", "ejs");

//POST METHOD
app
    .post('/', async (req, res) => {
        const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

// GET METHOD
app
    .get("/", (req, res) => {
        TodoTask.find()
        .then((tasks) => {
            res.render("todo.ejs", { todoTasks: tasks });
        })
        .catch((error) => {
            console.log(error);
        }); 
    });


//UPDATE METHOD
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find()
        .then((tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        })
        .catch((error) => {
            console.log(error);
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, { new: true })
        .then((err, updated) => {
            if (err && updated) {
                return res.sendStatus(500);
            }
            res.redirect("/");
        });
    });

//DELETE METHOD
app
    .route("/remove/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndDelete(id)
        .then((err, update) => {
            if (err && update) {
                return res.send(500);
            }
            res.redirect("/");
        });
    });
    