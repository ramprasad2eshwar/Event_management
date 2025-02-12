const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://Admin:admin@pizza.x1n3a.mongodb.net/event", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDb Connected"); //debugline
    } catch (error) {
        console.error("Database Connection Error", error);
        process.exit(1);
    }
}

module.exports = connectDB;