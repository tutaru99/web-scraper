const axios = require("axios");
const cheerio = require("cheerio");

// Declare Array to hold scraped items
let itemsArr = [];
let filter = [];
let nestedDetails = {};

axios
  .get("https://aniwatcher.com")
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

        // Push the scraped data into the array to filter
        filter[index] = { showName, episodeNo, watchShow, previewImage };
      }


      
      
    });
    
    
    // Filter data to avoid empty or undefined entries
    itemsArr = filter.filter(function (el) {
      return el != null;
    });

    // FINAL ARRAY
    console.log(itemsArr);

  }).catch((err) => {
    console.log(err);
  });






// TODO
  /* // Go to details page and scrape views number
    axios.get(itemsArr.watchShow).then((res) => {

            const $ = cheerio.load(res.data);
             $("#social").each((i, e) => {
              const views = $(e).find($(".pviews")).text();
              // push each to the array
              nestedDetails.views = views;
              itemsArr.push(nestedDetails);
              console.log("nested views", itemsArr);
             });

          })
          .catch((err) => {
            // console.log(err);
          }); */




          // 2nd ver
          // axios.get(watchShow).then((res) => {
          //   const $ = cheerio.load(res.data);
          //   const views = $(".pviews").text().trim();

          //   // push the data into the array to filter
          //   nestedDetails[index] = { views };

          //   console.log(nestedDetails);
          // });