import mongoose from "mongoose";

export function Connection() {
  const mongoURI = "mongodb+srv://bly23:J2fkcWcZlu88nB79@skigo-cluster.fduxd.mongodb.net/test?retryWrites=true&w=majority&appName=SkiGo-Cluster";

  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Reduce connection timeout to 5 seconds
  })
    .then(() => console.log("✅ Connected to MongoDB."))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));
}
