//____________________________________________________BEGIN app 
var express = require("express");
var app = express();
var expressHbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
app.use(bodyParser.urlencoded({
    extended: true
}));


app.set('view engine', 'hbs');

app.engine('hbs', expressHbs({
    extname: 'hbs'
}));


mongoose.connect('mongodb://localhost/app');

var Todo = mongoose.model('Todo', {
    task: {
        type: String,
        required: true
    }
});



app.get("/", function(req, res) {
    Todo.find(function(err, arrayOfItems) {
        res.render("index", {
            item: arrayOfItems
        })
    })
});



app.post("/client_to_server", function(req, res) {

    var task = new Todo({
        task: req.body.userData
    }).save()

    res.redirect("/")
});


app.get('/delete/:id', function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!err) {
            todo.remove();
        } else {
            return err
        }
    });
    return res.redirect('/');
})


app.get("/edit/:id", function(req, res) {
    Todo.findById(req.params.id, function(err, item) {
        res.render("edit", {
            todo: item
        })
    })
})


app.post('/update/:id', function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        todo.task = req.body.updated_task
        todo.save();
    });
    return res.redirect('/');
})








app.get("*", function(req, res) {
    res.redirect("/")
});




app.listen(3000, function(err) {
    if (err) {
        console.log('Server is not working ');
    } else {
        console.log('Server works')
    }
});
//____________________________________________________END app