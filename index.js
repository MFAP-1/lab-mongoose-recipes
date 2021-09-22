const mongoose = require("mongoose");

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require("./models/Recipe.model");
// Import of the data from './data.json'
const data = require("./data");

const MONGODB_URI = "mongodb://localhost:27017/recipe-app";

// Connection to the database "recipe-app"
async function init() {
  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `Connected to the database: "${connection.connections[0].name}"`
    );
    // Before adding any recipes to the database, let's remove all existing ones
    // return Recipe.deleteMany();
    connection.connections[0].dropDatabase();

    // Adding manually a new recipe
    const newRecipe = await Recipe.create({
      title: "MFAP's regular fries",
      level: "Easy Peasy",
      ingredients: ["potato", "oil", "salt"],
      cuisine: "traditional",
      dishType: "snack",
      duration: 60,
      creator: "MFAP",
      // created: "2021-06-23",
    });
    console.log(newRecipe.title);

    // Importing a database
    const importResult = await Recipe.insertMany(data);

    importResult.map((recipeObj) => {
      console.log(recipeObj.title);
    });

    // Updating a error in the db
    await Recipe.findOneAndUpdate(
      { title: "Rigatoni alla Genovese" },
      { duration: 100 }
    );
    console.log("update sucess.");

    // Deleting a recipe
    await Recipe.deleteOne({ title: "Carrot Cake" });
    console.log("deletion sucess.");

    // Closing the database
    mongoose.connection.close();
    console.log("database closed sucess.");
  } catch (err) {
    console.error("Error connecting to the database", err);
  }
}

init();
