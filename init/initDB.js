const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const express = require("express");
const router = express.Router();

async function InsertData() {
    try{
        const skills = [
            {id: 1, name: 'C++'},
            {id: 2, name: 'C#'},
            {id: 3, name: 'JS'},
            {id: 4, name: 'Unity'},
            {id: 5, name: 'UE5'},
            {id: 6, name: 'Godot'},
            {id: 7, name: 'Blender'},
            {id: 8, name: '3DsMax'},
            
        ]

        for(const skill of skills){
            const IsExisting = await prisma.skills.findUnique({
                where: {id: skill.id},
            });
            if(!IsExisting){
                prisma.skills.create({
                    skill,
                });
            }
        }
    }catch(error){
        console.error(error);
        console.log("Database init failed");
    }
}

module.exports = {
    InsertData,
}

    