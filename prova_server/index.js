// registrare delle squadre con nome e password (da query string)
// data structure chiave valore
// team e password non case sensitive
// salvare il timestamp per non far mandare richieste a manetta
// gestire se una squadra tenta di registrarsi ma si è già registrata
// tenersi anche lo score di ogni squadra

const express = require("express")
const app = express()

let teams = []
let nTeams = 0
let isAdmin = false
let mapSideDimension = 0
let mapStructure = []

app.use(express.json())
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.status(200).send("Server funzionante")
})

app.get("/signup", (req, res) => {
    let team = req.query.team
    let password = req.query.password
    nTeams++

    let alreadyRegistered = false
    for(let i=0; i<teams.length; i++) {
        if(teams[i].team === team) alreadyRegistered = true
    }
    
    if(alreadyRegistered) {
        res.send("Errore: team già esistente.")
    }
    else {
        teams.push({
            id: nTeams, 
            team: team.toLocaleLowerCase(), 
            password: password.toLocaleLowerCase(), 
            score: 0
        })
        res.send("Registrazione avvenuta con successo.")
    }
})

app.get("/login", (req, res) => {
    let team = req.query.team
    let password = req.query.password
    let teamExists = false
    let passwordExists = false

    for(let i=0; i<teams.length; i++) {
        if(teams[i].team==team && teams[i].password==password) {
            teamExists = true
            passwordExists = true
        }
        else if(teams[i].team==team && teams[i].password!=password) {
            teamExists = true
        }
        else if(teams[i].team!=team && teams[i].password==password) {
            passwordExists = true
        }
    }

    if(teamExists && passwordExists) {
        res.send("Login effettuato con successo.")
    }
    else if(teamExists && !passwordExists) {
        res.send("Password errata.")
    }
    else if(!teamExists && passwordExists) {
        res.send("Nome team errato")
    }
    else {
        res.send("Team non esistente")
    }
})

app.get("/adminLogin", (req, res) => {
    let team = req.query.team
    let password = req.query.password
    let teamExists = false
    let passwordExists = false

    if(team=="truck" && password=="gerryscotti") {
        teamExists = true
        passwordExists = true
    }
    else if(team=="truck" && password!="gerryscotti") {
        teamExists = true
    }
    else if(team!="truck" && password=="gerryscotti") {
        passwordExists = true
    }

    if(teamExists && passwordExists) {
        res.send("Login effettuato con successo.")
        isAdmin = true
    }
    else if(teamExists && !passwordExists) {
        res.send("Password errata.")
    }
    else if(!teamExists && passwordExists) {
        res.send("Nome team errato")
    }
    else {
        res.send("Team non esistente")
    }
})

app.get("/setMap", (req, res) => {
    if(isAdmin) {
        let mapDim = req.query.sideDim

        if(mapDim%1!=0) {
            res.status(500).send("Errore nella dimensione della mappa.")
        }
        else {
            mapSideDimension = mapDim
            for(let i=0; i<mapDim; i++) {
                let mapRow = []
                for(let j=0; j<mapDim; j++) {
                    mapRow.push({
                        x: i+1,
                        y: j+1,
                        dug: false,
                        dugBy: null,
                    })
                }
                mapStructure.push(mapRow)
            }
        }
        
        res.send("Mappa creata")
    }
    else {
        res.status(401).send("Accesso negato.")
    }
})

app.get("/setMapProva", (req, res) => {
    let mapDim = req.query.sideDim

    //res.send("Dimensione mappa: " + mapDim)
    if(mapDim%1!=0) {
        res.status(500).send("Errore nella dimensione della mappa.")
        return
    }
    mapSideDimension = mapDim
    for(let i=0; i<mapDim; i++) {
        let mapRow = []
        for(let j=0; j<mapDim; j++) {
            mapRow.push({
                x: i+1,
                y: j+1,
                dug: false,
                dugBy: null,
            })
        }
        mapStructure.push(mapRow)
    }
    res.send("OK")
})

app.get("/displayMapJSON", (req, res) => {
    res.send(mapStructure);
});

app.get("/displayMap", (req, res) => {
    let content = "<table>"
    for (let i = 0; i < mapSideDimension; i++) {
        content += "<tr>"
        for (let j = 0; j < mapSideDimension; j++) {
            const imgSrc = mapStructure[i][j].dug ? "grass.png" : "hole.png";
            content += "<td'><img src='" + imgSrc + "'></td>"; // Aggiungi l'elemento img con il percorso dell'immagine
        }
        content += "</tr>"
    }
    content += "</table>"
    res.send(content);
});

app.get("/digProva", (req, res) => {
    let xSelected = req.query.x
    let ySelected = req.query.y

    console.log(xSelected + ";" + ySelected)
    for(let i=0; i<mapSideDimension; i++) {
        for(let j=0; j<mapSideDimension; j++) {
            if(mapStructure[i][j].x==xSelected && mapStructure[i][j].y==ySelected) {
                mapStructure[i][j].dug = true
                mapStructure[i][j].dugBy = "unknown"
                res.send("Dig avvenuto con successo")
            }
        }
    }
    res.send("BENE")
})

app.get("/dig", (req, res) => {
    let teamDigging = req.query.team
    let passwordDigging = req.query.password
    let xSelected = req.query.x
    let ySelected = req.query.y
    let ok = false

    for(let k=0; k<teams.length; k++) {
        if(teams[k].team === teamDigging && teams[k].password === passwordDigging) {
            ok = true
        }
    }

    if(ok) {
        for(let i=0; i<mapSideDimension; i++) {
            for(let j=0; j<mapSideDimension; j++) {
                if(mapStructure[i][j].x===xSelected && mapStructure[i][j].y===ySelected) {
                    mapStructure[i][j].dug = true
                    mapStructure[i][j].dugBy = teamDigging
                    res.send("Dig avvenuto con successo")
                }
            }
        }
        res.send("BENE")
    }
    else {
        res.status(400).send("Non è stato possibile eseguire il dig")
    }
})

app.get("/getRegistrations", (req, res) => {
    res.send(teams)
})

app.listen(8080, () => {
    console.log("Server running on port 8080")
})