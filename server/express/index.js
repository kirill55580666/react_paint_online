const path = require('path')
const fs = require('fs')

const express = require('express')
const app = express()
const WServer = require('express-ws')(app)
const aWss = WServer.getWss()
const cors = require('cors')

const serverless = require('serverless-http')

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.ws('/', (ws, req) => {
    ws.on('message', msg => {
        msg = JSON.parse(msg)
        switch (msg.method) {
            case 'connection':
                connectionHandler(ws, msg)
                break;
            case 'draw':
                broadcastConnection(ws, msg)
                break
            case 'undo':
                broadcastConnection(ws, msg)
                break
            case 'redo':
                broadcastConnection(ws, msg)
                break
            case 'finish':
                broadcastConnection(ws, msg)
                break
        }

    })
})

app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace(`data:image/png;base64,`, '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({message: "Загружено"})
    } catch (e) {
        console.log(e)
        return res.status(500).json('error')
    }
})
app.get('/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        const data = `data:image/png;base64,` + file.toString('base64')
        res.json(data)
    } catch (e) {
        console.log(e)
        return res.status(500).json('error')
    }
})
// app.post('/history', (req, res) => {
//     try {
//         const data = req.body.
//         fs.writeFileSync(path.resolve(__dirname, 'history', `${req.query.id}.json`), data)
//         return res.status(200).json({message: "Загружено"})
//     } catch (e) {
//         console.log(e)
//         return res.status(500).json('error')
//     }
// })

//app.listen(PORT, () => console.log(`server on port ${PORT}`))

module.exports = app;
module.exports.handler = serverless(app)

const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg);
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if(client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}
