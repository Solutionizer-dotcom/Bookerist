const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const bcrypt = require("bcrypt")

app.use(express.json())

const users = []

app.get("/users", (req,res) => {
    res.json(users)
})

app.post("/users", async (req, res) => {
    try{
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        console.log(salt)
        console.log(hashPassword)
        const user = { name : req.body.name , password : hashPassword}
        users.push(user)
        res.status(201).send()      
    }catch{
        res.status(500).send()
    }
})

app.post("/users/login", async (req,res) => {
    const user = users.find( user => user.name = req.body.name)
    if(user == null) {
        return res.status(400).send("Utilisateur introuvable")
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send("Réussie")
        }else{
            res.send("Non autorisé")
        }
    }catch{
        res.status(500).send()
    }
})

app.listen(3000)
