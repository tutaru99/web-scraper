const axios = require("axios");
const cheerio = require("cheerio");

// Scraping function
axios.get("https://aniwatcher.com").then((res) => {
  // Declare Array to hold scrapet items
  let itemsArr = [];
  const filter = [];
  // Load the HTML into cheerio
  const $ = cheerio.load(res.data);

  // Scraping data from the page
  $("li").each((index, element) => {
    //   find the title by class
    const title = $(element)
        .find(".ser")
        .text()
        .trim();

        const episodeNo = $(element)
        .find(".title")
        .text()
        .trim();

        const image = $(element)
        .find(".img")
        .attr("style")

        const linkToWatch = $(element)
        .find(".ep")
        .attr("href");


        // generate direct link to series
        const link = "https://aniwatcher.com" + linkToWatch;


        //   if scraping class exists but it is empty, then skip
        if (title.length == 0) {
          return;
        } else {
            // bad solution!!
            const slicedimage = image.slice(21, 41);
            const newimg = "https://aniwatcher.com" + slicedimage;

            // Push the scraped data into the array before filtering
            filter[index] = { title, episodeNo, link, newimg };
        }
    });

  // Filter data to avoid empty or undefined entries
  itemsArr = filter.filter(function (el) {
    return el != null;
  });
  console.log(itemsArr);
});
