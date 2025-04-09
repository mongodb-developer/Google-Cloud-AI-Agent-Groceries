import { VertexAIEmbeddings } from "@langchain/google-vertexai";
import { MongoClient } from "mongodb";
import fs from "fs";
import { config } from "dotenv";

config(); // Load environment variables

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

const client = new MongoClient(MONGODB_URI);
const embeddingsModel = new VertexAIEmbeddings({
    model: "text-embedding-005"
});

async function vectorizeAndStoreProducts() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Load products from file
    const products = JSON.parse(fs.readFileSync("products.json", "utf-8"));

    // Generate embeddings and store in MongoDB
    for (const product of products) {
      console.log(`Processing: ${product.name}`);

      // Combine multiple attributes for embedding
      const textToEmbed = `${product.name}. ${product.category}. ${product.description}`;
      const [embedding] = await embeddingsModel.embedDocuments([textToEmbed]);

      // Prepare document
      const document = {
        name: product.name,
        description: product.description,
        category: product.category,
        embedding: embedding,
      };

      // Upsert into MongoDB (update if exists, insert if not)
      await collection.insertOne(document);
    }

    console.log("✅ All products vectorized and stored in MongoDB Atlas!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

// Run the function
vectorizeAndStoreProducts();
