import express from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import images from './public/js/images.js'

function runScript() {
    const section = document.querySelector('#home');
    console.log(images)
    const imagePreview = document.createElement('div');

    const content = images.map((image, index) => {
        return(
            `<div class="content">
                    <h2>${image.title}<h2>
                    <img src=${image.previewImage} alt="${image.title}"></img>
            </div>`
        );
    }).join(" ")

    imagePreview.innerHTML = content;
    section.innerHTML = "";
    section.appendChild(imagePreview)
}

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


const pptr = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle2',
    });
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = __dirname + '/public/js/index2.js'
    await page.addScriptTag({content: `${runScript}`})

    await page.evaluate(() => {
        document.querySelector("#hello").remove();
    })

    await page.pdf({ path: './public/pdfs/hn3.pdf', format: 'a4' });
    await browser.close();
  }

app.get('/', async (req, res) => {
    if(req.query.pdf)
        await pptr();
    res.render('index')
})

// app.post('/', async (req, res) => {
//     await pptr();
//     res.redirect('/')
// })

app.listen('3000', () => {
    console.log('runing on port 3000');
})