import { Context } from "hono";
import { getDB } from "../db";
import { meals } from "../db/schema";

export const add_meals = async (c: Context) => {
  try {
    const db = getDB(c);
    const body = await c.req.json();
    
    // Validate required fields
    if (!Array.isArray(body)) {
      return c.json({ error: "Request body must be an array" }, 400);
    }

    // Validate each meal object
    for (const meal of body) {
      const { id, name, description, price, image } = meal;
      if (!id || !name || !description || !price || !image) {
        return c.json({ error: "Missing required fields in one or more meals" }, 400);
      }
    }

    // Prepare meals data
    const mealsData = body.map(meal => ({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      price: Number(meal.price),
      image: meal.image,
      isAvailable: true,
    }));

    // Insert all meals into database
    await db.insert(meals).values(mealsData);

    return c.json({ 
      message: "Meals added successfully",
      meals: mealsData 
    }, 201);

  } catch (error) {
    console.error("Error adding meals:", error);
    return c.json({ error: "Failed to add meals" }, 500);
  }
};
