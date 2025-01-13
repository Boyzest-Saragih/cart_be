const express = require('express')
const cors = require('cors')
const cartRouter = require('./router/cart')

const app = express()

const PORT = process.env.PORT || "3000"

app.use(cors())
app.use("/api/cart",cartRouter)


app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})