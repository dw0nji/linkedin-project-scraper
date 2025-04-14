import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }



const linkedinURL = "https://www.linkedin.com/in/jonathan-ewers/";

const email = process.env.EMAIL; 
const password = process.env.PASSWORD; 

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();


await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');


await page.goto('https://www.linkedin.com/login');

await page.type('#username', email);
await page.type('#password', password);
console.log("logging in");


await page.click('[type="submit"]'),
console.log("logged in");
//await delay(50000); // Wait for 30 seconds or adjust as needed


await page.waitForNavigation(),

console.log("page loaded successfully");



await page.goto(linkedinURL);

console.log("going to profile page");

// Wait for projects to load
//await page.waitForSelector('section.pv-profile-section'); // Might need to refine this

console.log("logged in loaded content");

await page.waitForSelector('[id="projects"]');

const projectsPage = await page.$('[id="projects');



const parentElement = await projectsPage.evaluateHandle(el => el.parentElement); // gets the parent section 


await parentElement.evaluate(parent => {//presses on the button that opens the show more handle

    const link = parent.querySelector('a[id="navigation-index-see-all-projects"]');
    if (link) {
        link.click();
    }
});
console.log("pressed on projects");

await page.waitForSelector('main[aria-label="Projects"]'); // waiting on next page to load

const main = await page.$('main[aria-label="Projects"]');

await page.waitForSelector('ul'); // waiting on next page to load


const cards = await main.$('ul'); //gets the html ul (projects) with all the li (cards)

//Projects page has been opened up
let json = {};
json.projects = [];

await cards.$$eval(':scope > li', listItems => {
    return listItems
        // .filter(card => {
        //     const spans = card.querySelectorAll('span');
        //     return spans.length > 0 && Array.from(spans).every(span => !span.classList.contains('visually-hidden'));
        // })
        .map(card => {
            const jsonObj = {};

            const spans = card.querySelectorAll('span[aria-hidden="true"]');
            if(spans.length > 1){
                const title = spans[0]; //get first span 
                if(title ){
                    jsonObj.title = title.innerText.trim(); // title

                }
                const date = spans[1]; 
                if(date){
                    jsonObj.date = date.innerText.trim(); // title

                }
            }

            const ul = card.querySelector('ul');
            const project_card_sections = ul ? ul.querySelectorAll(':scope > li') : [];
            const size = project_card_sections.length;


            //Description section
            if(size > 0){
                const x = project_card_sections[0].querySelectorAll('span[aria-hidden="true"]');
                if(x){
                    jsonObj.description = Array.from(x).map(span => span.innerText.trim()).join(' ');
                }
            }


            //skill section

            if(size > 1){
                const x = project_card_sections[1].querySelectorAll('span[aria-hidden="true"]');
                if(x){
                    jsonObj.skills = Array.from(x).map(span => span.innerText.trim()).join(' ');

                }
            }

            //image section 
            if(size > 2){
                const anchor = card.querySelector('a');
                if (anchor) {
                    jsonObj.img = anchor.href;
                }
            }

            return jsonObj;
        });
}).then(results => {
    json.projects = results;
});



console.log(json);  // Logs the filtered project sections



browser.close();

