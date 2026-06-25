import { Router } from "express";
import { getWeatherByCity } from "../services/weatherService.js";
import { getRecentSearches, saveSearch } from "../services/searchStore.js";

const router = Router();

router.get("/history", async (_, response, next) => {
  try {
    const history = await getRecentSearches();
    response.json({ history });
  } catch (error) {
    next(error);
  }
});

router.get("/weather/:city", async (request, response, next) => {
  try {
    const city = request.params.city;

    if (!city?.trim()) {
      return response.status(400).json({ message: "City is required" });
    }

    const weather = await getWeatherByCity(city);
    await saveSearch(weather.city);
    const history = await getRecentSearches();

    response.json({
      weather,
      history
    });
  } catch (error) {
    next(error);
  }
});

export default router;
