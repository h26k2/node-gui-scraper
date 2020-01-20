const port = 3000;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));


app.listen(port,()=>{
    console.log(`node app is live at port : ${port}`);
})
