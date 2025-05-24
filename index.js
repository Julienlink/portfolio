const express = require("express");
const os = require("os");
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

function getPublicIp(){
    const interfaces = os.networkInterfaces();
    for (let interface in interfaces) {
        for (let address of interfaces[interface]) {
            // Vérifie si l'adresse est IPv4 et non une adresse de boucle
            if (address.family === 'IPv4' && !address.internal) {
                return address.address; // Retourne l'adresse IP publique
            }
        }
    }
    return '0.0.0.0';
}

//CHEMIN ROOT
app.get("/", async (req,res)=>{
    const highlighted = await prisma.projects.findMany({
        where: {
            isHighlight : true,
        },
        take: 5,
    });
    const projects = await prisma.projects.findMany();
    res.render("index",{highlighted, projects});
})

//CHEMIN A PROPOS
app.get("/self",async (req,res)=>{
    res.render("self");
})

//CHEMIN CV
app.get("/CV", async (req,res)=>{
    res.sendFile(path.join(__dirname, 'public/data/CV_Julien_Demaiziere.pdf'));
})


//CHEMIN PROJETS
app.get("/projects", async (req,res)=>{
    const Projets = await prisma.projects.findMany();
    res.render("projects",{Projets});
})


app.get("/project/:nom",async (req,res)=>{
    //récupere le projet
    const Proj = await prisma.projects.findFirst({
        where: {
            projectName : req.params.nom,
        },
    })

    //récupère les compétence associé
    const Skills = await prisma.skills.findMany({
    where: {
        skillId: {
            in: await prisma.appliedSkills.findMany({
                where: {
                    projectId: Proj.projectId,
                },
                select: {
                    skillId: true, 
                },
            }).then(skills => skills.map(skill => skill.skillId)), 
        },
    },
});
    //récupère les images associé
    const imgDir = path.join(__dirname,'public','image',Proj.projectName);

    fs.readdir(imgDir, (err,files)=>{
        const images = files.filter(file => /\.(jpg|jpeg|png)$/.test(file));

        console.log()
    res.render("projects/project", {Proj,Skills,images});
    });
});



app.listen(PORT,()=>{
    const publicIP = getPublicIp();
    console.log(`server running at http://localhost:${PORT}`);
})