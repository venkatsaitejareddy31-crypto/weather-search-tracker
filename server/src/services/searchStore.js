import mongoose from "mongoose";
import Search from "../models/Search.js";

const memoryHistory = [];

function normalizeCity(city) {
  return city.trim().replace(/\s+/g, " ");
}

function slugify(city) {
  return normalizeCity(city).toLowerCase();
}

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log("MONGODB_URI not set. Using in-memory history store.");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.warn("MongoDB connection failed, using in-memory history store instead.");
    console.warn(error.message);
  }
}

export async function saveSearch(city) {
  const cleanCity = normalizeCity(city);
  const slug = slugify(cleanCity);
  const searchedAt = new Date();

  if (mongoose.connection.readyState === 1) {
    await Search.findOneAndUpdate(
      { slug },
      {
        $set: {
          city: cleanCity,
          searchedAt
        },
        $setOnInsert: {
          count: 0
        },
        $inc: {
          count: 1
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    return;
  }

  const existingIndex = memoryHistory.findIndex((entry) => entry.slug === slug);

  if (existingIndex >= 0) {
    memoryHistory[existingIndex] = {
      ...memoryHistory[existingIndex],
      city: cleanCity,
      searchedAt,
      count: memoryHistory[existingIndex].count + 1
    };
    return;
  }

  memoryHistory.unshift({
    city: cleanCity,
    slug,
    searchedAt,
    count: 1
  });
}

export async function getRecentSearches(limit = 6) {
  if (mongoose.connection.readyState === 1) {
    const items = await Search.find().sort({ searchedAt: -1 }).limit(limit);
    return items.map((item) => ({
      city: item.city,
      searchedAt: item.searchedAt,
      count: item.count
    }));
  }

  return [...memoryHistory]
    .sort((left, right) => new Date(right.searchedAt) - new Date(left.searchedAt))
    .slice(0, limit)
    .map(({ city, searchedAt, count }) => ({
      city,
      searchedAt,
      count
    }));
}
