const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;


// Variables
let globalViews = {};
let globalViews22 = {};

let itemsArr = [];
let filter = [];
const finalArray = [];


// Website(-s) to be scraped
const aniwatcher = "https://aniwatcher.com";


axios
  .get(aniwatcher)
  .then((res) => {
    // Load the HTML into cheerio
    const $ = cheerio.load(res.data);

    // Scraping data from the page
    $("li").each((index, element) => {
      //   find the title by class
      const showName = $(element).find(".ser").text().trim();
      const episodeNo = $(element).find(".title").text().trim();
      const image = $(element).find(".img").attr("style");
      const linkToWatch = $(element).find(".ep").attr("href");
      // generate direct link to series
      const watchShow = "https://aniwatcher.com" + linkToWatch;

      // if scraping class exists but it is empty then skip
      if (showName.length == 0) {
        return;
      } else {
        //improve this solution!!
        const slicedimage = image.slice(21, 41);
        const previewImage = "https://aniwatcher.com" + slicedimage;

        // Push the scraped data into the array to filter to avoid empty values
        filter[index] = { showName, episodeNo, watchShow, previewImage };
      }
    });

    // Filter data to avoid empty or undefined entries
    itemsArr = filter.filter(function (el) {
      return el != null;
    });
  })
  .then(() => {
    // Scrape details from each show - details asd
    itemsArr.forEach((item) => {
      axios
        .get(item.watchShow)
        .then((res) => {
          const $ = cheerio.load(res.data);
          // Scraping data from the page
          $("#social").each((index, element) => {
            if ($(element).attr("id") == "social") {
              const nestedViews = $(".pviews").text().trim();
              globalViews = { nestedViews };
            }
          });
          // Scraping data from the same page x2 - testing to get multiple items from page
          $("#social").each((index, element) => {
            if ($(element).attr("id") == "social") {
              const nestedViews22 = $(".pviews").text().trim();
              globalViews22 = { nestedViews22 };
            }
          });
        })
        .then(() => {
          // Push the scraped data into the FINAL array
          finalArray.push({
            showName: item.showName,
            episodeNo: item.episodeNo,
            previewImage: item.previewImage,
            watchShow: item.watchShow,
            nestedDetails: {
              nestedViews: globalViews.nestedViews,
              nestedViews22: globalViews22.nestedViews22,
            },
          });
          if (finalArray.length == itemsArr.length) {
            // Not sure how to handle this properly yet
          } else {
            return;
          }
          // console.log(finalArray);
        })
        .finally(() => {
          app.get("/", (req, res) => {
            res.json(finalArray);
          });
        });
    });
  })
  .catch((err) => {
    console.log(err);
  });





// start function after 1.5 seconds
setTimeout(() => {
  // console.log("delay start to make sure array has time to be scraped and populated", finalArray);
}, 1500);




app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`);
});