const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const cors = require("cors")
const { httpServer, app } = require("./socket/socket")
require("dotenv").config()

app.use(express.json())
app.use(express.static("dist"))
app.use(cors({ origin: true, credentials: true }))

app.use("/api/blog", require("./routes/blog.route"))

app.use("*", (req, res) => {
    // res.sendFile(path.join(__dirname), "dist", "index.html")
    res.status(404).json({ message: "Resource not found" })
})
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: "SERVER ERROR", error: err.message })

})

mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("SERVER RUNNING")
    httpServer.listen(process.env.PORT, console.log("MONGO CONNECTED")
    )

})