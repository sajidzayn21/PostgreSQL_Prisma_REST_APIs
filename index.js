import express from 'express';
import "dotenv/config";
import routes from "./routes/index.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())

app.get('/', (req, res) => {
    return res.send('Hey, World! 2.0');
})

app.use(routes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)

})