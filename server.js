import {config} from "dotenv";
config();

import * as express from 'express';
import path from "node:path";
import {fileURLToPath} from "node:url";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory


const app = express.application();

app.use(express.static(path.join(__dirname, '/build/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
});

// eslint-disable-next-line no-undef
app.listen(process.env.PORT || 3000, () => {
    // eslint-disable-next-line no-undef
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
