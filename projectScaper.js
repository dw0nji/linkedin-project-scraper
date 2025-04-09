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
await delay(50000); // Wait for 30 seconds or adjust as needed


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

const cards = await main.$('ul'); //gets the html ul (projects) with all the li (cards)

//Projects page has been opened up
let json = {};
json.projects = [];

const projects = await cards.$$eval('li',x => {

    return x.filter(card => {
                        const spans = card.querySelector('span'); // removes any text that is hidden
                        return Array.from(spans).every(span => !span.classList.contains('visually-hidden'));
                    }
                    )
            .map(card  => {
            
                const spans = card.quarySelectorAll('span');//get first span 
                const jsonObj = {};
                if(spans.length === 4){


                    const title = card.quarySelectorAll('span')[0].innerText; //title
                    const date = card.quarySelectorAll('span')[1].innerText; //date
                    jsonObj.title = title;
                    jsonObj.date = date;

                }
                const innerList = card.querySelectorAll('span');
                if(innerList.length >= 1){
                    const paragraph = innerList[0].innerText; //paragraph text
                    const imagelink = innerList[2].innerText.querySelector('a'); //get the first a element and extract the image link
                    jsonObj.paragraph = paragraph;
                    jsonObj.img = imagelink;

                }
                json.projects.push(jsonObj);
        
            }
        
        
        );  // Extracts innerText from each li and trims it

  });



console.log(json);  // Logs the filtered project sections



browser.close();
