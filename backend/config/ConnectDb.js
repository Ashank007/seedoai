import mongoose from "mongoose";

const ConnectDb = () => {
   mongoose.connect(process.env.MONGODB_URI, {
	dbName:'seedoai'
   })
     .then(() => console.log("MongoDB Connected"))
     .catch((err) => console.log(err));
}

export default ConnectDb;
