const axios = require('axios');
const cheerio = require('cheerio')

// Scraping function
axios.get('https://blog.sonicmoderna.com')
    .then(res => {
        // Declare Array to hold scrapet items
        const itemsArr = [];
        // Load the HTML into cheerio
        const $ = cheerio.load(res.data);

        // Scraping data from the page
        $('.post').each((index, element) => {

            const title = $(element)
                .find(".excerpt-title")
                .text()
                .trim();

            const link = $(element)
                .find("a")
                .attr("href")
                .trim();

            const date = $(element)
                .find(".excerpt-meta")
                .text()
                .trim();

            const bridge = $(element)
                .find(".excerpt-content")
                .text()
                .trim();

            const img = $(element)
                .find(".featured-image")
                .attr("data-background");

            // Push the scraped data into the array
            itemsArr[index] = { title, link, date, bridge, img };
        });

        console.log(itemsArr);
    })