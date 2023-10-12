import mongoose,{ConnectOptions} from "mongoose";
const { ServerApiVersion } = require("mongodb");

require('dotenv').config();

// generate connection url from mongodb atlas website
const url: string  = process.env.DATABASE_URL!

async function connectToDatabase(): Promise<void> {
    try {
        const options: ConnectOptions = {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        };

        await mongoose.connect(url, options);
        console.log("You successfully connected to MongoDB using Mongoose!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

export default connectToDatabase;

