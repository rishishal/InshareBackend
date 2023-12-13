import mongoose from "mongoose";

function connectDB() {
  // Database connection 🥳
  mongoose.connect(process.env.MONGO_URI!);

  const connection = mongoose.connection;

  connection.once("open", () => {
    console.log("Database connected 🥳🥳🥳🥳");
  });

  connection.on("error", (error) => {
    console.log("Connection failed ☹️☹️☹️☹️");
    console.error(error);
  });
}

export default connectDB;
