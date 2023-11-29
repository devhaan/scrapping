# scrapping




Puppeteer Web Scraping & MongoDB Data Storage
Objective:
The script performs web scraping using Puppeteer to extract agency details from multiple pages on 'https://wm/agencies/list/'. The extracted data is then stored in a MongoDB database using Mongoose.

Dependencies:
Puppeteer: Automates browser actions to navigate web pages, extract data, and create new pages.
Mongoose: Facilitates interaction with MongoDB by defining schemas and models for data storage.
Functionality:
Puppeteer Setup:

Launches a headful Puppeteer browser to perform web scraping.
MongoDB Connection:

Connects to a MongoDB database using Mongoose.
Uses the provided MongoDB URI to establish the connection.
Mongoose Schema & Model:

Defines a Mongoose schema (yourSchema) specifying the structure of agency data.
Creates a model (YourModel) based on the defined schema for MongoDB interaction.
Web Scraping Loop:

Iterates through multiple pages (from 1 to 36) of the URL 'https:///agencies/list/'.
Fetches data from each page to extract agency information.
Data Extraction and Storage:

Navigates to each agency's page from the list and extracts specific agency details:
Agency image, link, name, details, description, budget, pricing model, industries, languages, geographical focus, client business size, and services.
Uses page.evaluate() within a loop to extract data elements from the page.
Saves the extracted data into MongoDB by creating instances of YourModel and calling save().
Delay and Closure:

Adds delay between page accesses using setTimeout() to prevent being blocked.
Closes browser instances after completing the scraping process.
Notes:
Ensure Puppeteer and Mongoose are installed (npm install puppeteer mongoose) to run the script successfully.
Replace the provided MongoDB connection URI (uri) with the appropriate connection string for your MongoDB deployment.
Adjustments might be needed in the scraping logic if the structure of the target website changes.
Monitor the scraping process to avoid being blocked by the target website and adhere to ethical scraping practices.
This script efficiently scrapes agency data from multiple pages on the specified URL and stores it in a MongoDB database for further analysis or usage.






// Import required libraries
const puppeteer = require("puppeteer");
const mongoose = require("mongoose");

// Connection URI. Replace this with your MongoDB deployment's connection string
const uri = "mongodb+srv://@cluster0.llmwezd.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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
  // ... (other fields defined in the schema)
  agencyServices: {}, // Object type field
});

// Create a model based on the schema
const YourModel = mongoose.model("YourModel", yourSchema);

// Puppeteer actions
(async () => {
  // Launch Puppeteer browser
  const browser = await puppeteer.launch({ headless: false }); // Headful mode for visibility
  
  // Loop through pages
  for (let pagePointer = 1; pagePointer < 37; pagePointer++) {
    console.log("page -----------> ", pagePointer);
    
    // Open page and navigate to a specific URL
    const page = await browser.newPage();
    await page.goto(`https://agencies/list/?page=${pagePointer}`);

    // Wait for elements to load
    await page.waitForSelector("#__next > div > div.RiE-qT6m > div > div > div > div");

    // Extract links from the page
    const links = await page.$$eval(
      "#__next > div > div.RiE-qT6m > div > div > div > div a",
      (anchors) => anchors.map((a) => a.getAttribute("href"))
    );

    // Loop through extracted links
    for (const link of links) {
      // Open a new page for each link
      const newPage = await browser.newPage();
      await newPage.goto(`https://xyz${link}`);
      
      // Wait for 2 seconds (for illustration, not best practice)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check for the presence of an element
      const counts = (await newPage.$("#success-stories")) ? 1 : 0;
      
      // Extract data from the page
      const data = await newPage.evaluate(async (count) => {
        // Data extraction logic using document.querySelector, etc.
        // ... (code for data extraction)

        return {
          // Extracted data fields
          agencyImage,
          agencyLink,
          // ... (other extracted fields)
          agencyServices,
        };
      }, counts);

      // Create a new instance of the model and save the data to MongoDB
      const instance = new YourModel(data);
      try {
        await instance.save();
      } catch (error) {
        console.log(error);
      }

      // Close the new page
      await newPage.close();
    }
    
    // Add delay between page accesses (for illustration, not ideal)
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  // Close the browser after scraping
  await browser.close();
})();


