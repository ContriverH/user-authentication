const express = require("express")
const app = express()
const bcrypt = require('bcrypt')
const e = require("express")

app.use(express.json())

const users = []

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users', async (req, res) => {
    try{
        const salt = await bcrypt.genSalt() // the defaul value for the number of rounds for creating the salt is 10
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = {name: req.body.name, password: hashedPassword}
        users.push(user)
        res.status(201).send()
    }catch {
        res.status(500).send()
    }
})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name == req.body.name)
    if(user == null){
        return res.status(400).send('Can not find user')
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send('Successfully logged in.')
        }else{
            res.send('Password not matching! Please try again.')
        }
    }catch {
        res.status(500).send()
    }
})

app.listen(3000, () => {
    console.log("Server started");
})