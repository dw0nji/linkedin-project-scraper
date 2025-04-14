# linkedin-project-scraper
A simple script utilizing puppeteer to log in to LinkedIn and fetch your project data.
The data is parsed into a JSON format and printed out. 
This script only works if your profile has a 'Projects' section and has more than 3 projects.

# Project setup
1. Download all the necessary dependencies
2. Create a .env file with these two attributes: EMAIL and PASSWORD.
3. Swap out the LinkedIn URL with your desired URL of a page that has a projects section
4. The JSON data is structured as follows:
   projects:[
     {
       title: '',
       date: '',
       description: '',
       skills: '',
       img: ''
     }

   ]
5. Be creative and do what you like with the JSON output!
