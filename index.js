const puppeteer = require("puppeteer");

const mongoose = require("mongoose");

// Connection URI. Replace this with your MongoDB deployment's connection string
const uri =
  "mongodb+srv://devemahore:dev07dev@cluster0.llmwezd.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Event handling for successful connection
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Event handling for connection error
db.on("error", console.error.bind(console, "Connection error:"));

// Event handling for disconnection
db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// Define a Mongoose schema (optional)
const Schema = mongoose.Schema;
const yourSchema = new Schema({
  agencyImage: String,
  agencyLink: String,
  agencyName: {
    type: String,
    unique: true, // `agencyName` must be unique
  },
  agencyDetails: String,
  agencyDescription: String,
  agencyBudget: [String],
  agencyPricingModel: [String],
  agencyIndustries: [String],
  agencyLanguages: [String],
  agencyGeographicalFocus: [String],
  agencyClientBusinessSize: [String],
  agencyServices: {},
});

// Create a model based on the schema
const YourModel = mongoose.model("YourModel", yourSchema);

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  for (let pagePointer = 1; pagePointer < 37; pagePointer++) {
    console.log("page -----------> ", pagePointer);
    await page.goto(
      `https://www.semrush.com/agencies/list/?page=${pagePointer}`
    );

    // Wait for the list elements to load
    await page.waitForSelector(
      "#__next > div > div.RiE-qT6m > div > div > div > div"
    );

    const links = await page.$$eval(
      "#__next > div > div.RiE-qT6m > div > div > div > div a",
      (anchors) => anchors.map((a) => a.getAttribute("href"))
    );

    for (const link of links) {
      const newPage = await browser.newPage();
      await newPage.goto(`https://www.semrush.com${link}`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Waits for 3 seconds
      const counts = (await newPage.$("#success-stories")) ? 1 : 0;
      let dynamic;
      const data = await newPage.evaluate(async (count) => {
        const agencyImage = document
          .querySelector(
            "#__next > div > div > div > div:nth-child(1) > div > div > picture > img"
          )
          .getAttribute("src");
        const agencyLink = document
          .querySelector(
            "#__next > div > div > div > div:nth-child(1) > div > div > a"
          )
          .getAttribute("href");
        const agencyName = document.querySelector(
          "#__next > div > div > div > div:nth-child(1) > div > div > a > h1"
        ).innerHTML;
        const agencyDetails = document.querySelector(
          "#__next > div > div > div > div:nth-child(1) > div"
        ).innerHTML;
        const agencyDescription = document.querySelector(
          "#__next > div > div > div > div:nth-child(1) > div"
        ).innerHTML;

        const agencyBudget = document.querySelector(
          "#__next > div > div > div > div > div:nth-child(1) > ul > li > h6"
        ).innerText;
        let agencyPricingModel = [];
        dynamic = count ? 4 : 3;
        const listTags = Array.from(
          document.querySelectorAll(
            `#__next > div > div > div > div:nth-child(${dynamic}) > ul`
          )
        ); // Fetching all <ul> and <ol> elements
        listTags.forEach((list) => {
          const items = Array.from(list.querySelectorAll("li")); // Fetching <li> elements within each list
          items.forEach((item) => {
            agencyPricingModel.push(item.textContent.trim()); // Pushing the text content of <li> elements into the array
          });
        });
        dynamic = count ? 7 : 6;
        let agencyIndustries = [];
        const listIndustriesTags = Array.from(
          document.querySelectorAll(
            `#__next > div > div > div > div:nth-child(${dynamic}) > ul`
          )
        ); // Fetching all <ul> and <ol> elements

        listIndustriesTags.forEach((list) => {
          const items = Array.from(list.querySelectorAll("span")); // Fetching <li> elements within each list
          items.forEach((item) => {
            agencyIndustries.push(item.textContent.trim()); // Pushing the text content of <li> elements into the array
          });
        });

        let agencyLanguages = [];
        dynamic = count ? 8 : 7;
        const listLanguagesTags = Array.from(
          document.querySelectorAll(
            `#__next > div > div > div > div:nth-child(${dynamic}) > ul`
          )
        ); // Fetching all <ul> and <ol> elements

        listLanguagesTags.forEach((list) => {
          const items = Array.from(list.querySelectorAll("li")); // Fetching <li> elements within each list
          items.forEach((item) => {
            agencyLanguages.push(item.textContent.trim()); // Pushing the text content of <li> elements into the array
          });
        });

        let agencyGeographicalFocus = [];
        dynamic = count ? 9 : 8;
        const listGeographicalFocusTags = Array.from(
          document.querySelectorAll(
            `#__next > div > div > div > div:nth-child(${dynamic}) > ul`
          )
        ); // Fetching all <ul> and <ol> elements

        listGeographicalFocusTags.forEach((list) => {
          const items = Array.from(list.querySelectorAll("li> h6")); // Fetching <li> elements within each list
          items.forEach((item) => {
            agencyGeographicalFocus.push(item.textContent.trim()); // Pushing the text content of <li> elements into the array
          });
        });

        let agencyClientBusinessSize = [];
        dynamic = count ? 5 : 4;
        const listClientBusinessSizeTags = Array.from(
          document.querySelectorAll(
            `#__next > div > div > div > div:nth-child(${dynamic}) > ul`
          )
        ); // Fetching all <ul> and <ol> elements

        listClientBusinessSizeTags.forEach((list) => {
          const items = Array.from(list.querySelectorAll("a > span")); // Fetching <li> elements within each list
          items.forEach((item) => {
            agencyClientBusinessSize.push(item.textContent.trim()); // Pushing the text content of <li> elements into the array
          });
        });

        let agencyServices = {};
        dynamic = count ? 6 : 5;
        const listServicesTags = Array.from(
          document.querySelectorAll(
            `#__next > div > div > div > div:nth-child(${dynamic}) > div`
          )
        ); // Fetching all <ul> and <ol> elements

        listServicesTags.forEach((list) => {
          console.log(list);
          const items = Array.from(list.querySelectorAll("ul")); // Fetching <li> elements within each list
          items.forEach((item, index) => {
            const point = index + 1;
            let key = document
              .querySelector(
                `#__next > div > div > div > div:nth-child(${dynamic}) > div > div:nth-child(${point}) > a > span`
              )
              .innerText.trim();
            // Check if the key exists in agencyServices, if not, initialize it as an empty array
            key += "";
            if (!agencyServices[key]) {
              agencyServices[key] = [];
            }

            const itemsUl = Array.from(item.querySelectorAll("a > span"));
            itemsUl.forEach((item) => {
              agencyServices[key].push(item.textContent.trim()); // Pushing the text content of <li> elements into the array
            });
          });
        });

        return {
          agencyLink,
          agencyImage,
          agencyName,
          agencyDetails,
          agencyDescription,
          agencyBudget,
          agencyPricingModel,
          agencyIndustries,
          agencyLanguages,
          agencyGeographicalFocus,
          agencyClientBusinessSize,
          agencyServices,
        };
      }, counts);
      // Create a new instance of the model and save the data
      const instance = new YourModel(data);
      try {
        await instance.save();
      } catch (error) {
        console.log(error);
      }
      await newPage.close();
    }
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Waits for 10 seconds
  }

  await browser.close();
})();
