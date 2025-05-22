const express = require("express");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const path = require("path");
const fs = require("fs");

const app = express();
const prisma = new PrismaClient();
const PORT = 4096;

const imageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname,image);
        if(!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now + '-' + Math.round(Math.random()* 1e9);
        cb(null,uniqueSuffix + path.extname(file.originalname));
    }
})

const upload = multer({storage: imageStorage});

app.set("view engine", "hbs"); 
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views", "partials"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", async (req,res)=>{
    const highlighted = await prisma.projects.findMany({
        where: {
            isHighlight : true,
        },
    });
    const projects = await prisma.projects.findMany();
    res.render("index",{highlighted, projects});
})



app.listen(PORT,()=>{
    console.log(`server running at http://localhost:${PORT}`);
})