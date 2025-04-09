import { MongoClient, Collection, ObjectId, OptionalId } from "mongodb";
import { config } from "dotenv";

config(); // Load environment variables

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

export interface Product {
    _id: ObjectId;
    name: string;
    description: string;
    category: string;
}

export interface ProductWithEmbedding extends Product {
    embedding: number[];
}

export interface Cart {
    _id: ObjectId;
    userId: string;
    items: Product[];
}

export interface Order {
    userId: string;
    items: Product[];
    date: Date;
}

let collections: {
    groceries?: Collection<OptionalId<ProductWithEmbedding>>;
    carts?: Collection<OptionalId<Cart>>;
    orders?: Collection<OptionalId<Order>>;
} = {};

export async function connectToDatabase(uri = MONGODB_URI) {
    const client = new MongoClient(uri, { appName: 'devrel.googlecloud.agent' });
    await client.connect();

    const db = client.db(DB_NAME);

    const groceries = db.collection<OptionalId<ProductWithEmbedding>>("groceries");
    collections.groceries = groceries;

    const carts = db.collection<OptionalId<Cart>>("carts");
    collections.carts = carts;

    const orders = db.collection<OptionalId<Order>>("orders");
    collections.orders = orders;

    return { client, collections };
}
