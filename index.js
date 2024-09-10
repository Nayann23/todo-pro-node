const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


app.get("/", function (req, res) {
  fs.readdir("./files", function (err, files) {
    if (err) {
      return res.status(500).send("Error reading files directory.");
    }
    res.render("index", { files: files });
  });
});

app.get("/file/:filename", function (req, res) {
  const filePath = path.join(__dirname, "files", req.params.filename);
  
  fs.readFile(filePath, "utf-8", function (err, filedata) {
    if (err) {
      return res.status(404).send("File not found.");
    }
    res.render("show", { filename: req.params.filename, filedata: filedata });
  });
});


app.get("/edit/:filename", function (req, res) {
  res.render("edit", { filename: req.params.filename });
});


app.post("/edit", function (req, res) {
  const oldFilePath = path.join(__dirname, "files", req.body.previous);
  const newFilePath = path.join(__dirname, "files", req.body.new);

  fs.rename(oldFilePath, newFilePath, function (err) {
    if (err) {
      return res.status(500).send("Error renaming the file.");
    }
    res.redirect("/");
  });
});


app.post("/create", function (req, res) {
  
  const title = req.body.title.split(' ').join('');
  const filePath = path.join(__dirname, "files", `${title}.txt`);

  fs.writeFile(filePath, req.body.details, function (err) {
    if (err) {
      return res.status(500).send("Error creating the file.");
    }
    res.redirect("/");
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
