const express = require('express');
let app = express();
const path = require('path');
const fs = require('fs');


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
 
app.get("/", function(req, res) {
    fs.readdir('./files', (err, files) => {
        if (err) {
          console.error('Error reading directory:', err);
          return;
        }
        res.render("index", {files: files});
    });
})

app.post("/create", function(req, res) {
    if(req.body.title.trim()==='') {
        res.redirect('/');
    } else {
        fs.writeFile(`./files/${req.body.title.split(' ').join('')}`, `${req.body.details}`, function(err) {
            if(err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        })
    }
})

app.get("/read/:filename", function(req, res) {    
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', function(err, fileData) {
        if (err) {
            console.log(`Error reading file: ${err}`);
            return;
        }
        res.render("readfile", {filename: req.params.filename, filedata: fileData});
    });
});

app.get(`/delete/:filename`, function(req, res) {
    fs.unlink(`./files/${req.params.filename}` , function(err) {
        res.redirect('/');
    })
})

app.get('/edit/:filename', function(req, res) {
    res.render("edit", {oldfileName: req.params.filename});
})

app.post('/editfile', function(req, res) {
    fs.rename(`./files/${req.body.oldName}`, `./files/${req.body.newName}` , function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("file name updated")
            res.redirect('/');
        }
    })
})

app.listen(3000, function() {
    console.log("server is running on 3000");
})