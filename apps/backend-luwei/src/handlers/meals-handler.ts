import { Context } from "hono";
import { getDB } from "../db";
import { meals } from "../db/schema";
import { eq } from "drizzle-orm";

export const add_meals = async (c: Context) => {
  try {
    const db = getDB(c);
    const body = await c.req.json();
    
    // Validate required fields
    const { id, name, description, price, image } = body;
    if (!id || !name || !description || !price || !image) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Prepare meal data
    const mealData = {
      id,
      name,
      description,
      price: Number(price),
      image,
      isAvailable: true,
    };

    // Check for existing meal
    const existingMeal = await db
      .select()
      .from(meals)
      .where(eq(meals.id, id))
      .limit(1);

    if (existingMeal.length > 0) {
      return c.json({ 
        error: "Meal already exists",
        existingMeal: existingMeal[0].id
      }, 409);
    }

    // Insert meal into database
    await db.insert(meals).values(mealData);

    return c.json({ 
      message: "Meal added successfully",
      meal: mealData 
    }, 201);

  } catch (error) {
    console.error("Error adding meal:", error);
    return c.json({ error: "Failed to add meal" }, 500);
  }
};

export const fetch_meals = async (c: Context) => {
  try {
    const db = getDB(c);
    
    // Fetch all meals from database
    const allMeals = await db.select().from(meals);

    return c.json({ 
      message: "Meals fetched successfully",
      meals: allMeals 
    }, 200);

  } catch (error) {
    console.error("Error fetching meals:", error);
    return c.json({ error: "Failed to fetch meals" }, 500);
  }
};

export const edit_meals = async (c: Context) => {
  try {
    const db = getDB(c);
    const body = await c.req.json();
    
    // Validate required fields
    const { id, name, description, price, image, isAvailable } = body;
    if (!id || !name || !description || !price || !image || typeof isAvailable !== 'boolean') {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Update meal in the database
    await db
      .update(meals)
      .set({
        name,
        description,
        price: Number(price),
        image,
        isAvailable,
      })
      .where(eq(meals.id, id));

    return c.json({ 
      message: "Meal updated successfully",
      meal: body 
    }, 200);

  } catch (error) {
    console.error("Error updating meal:", error);
    return c.json({ error: "Failed to update meal" }, 500);
  }
};

export const delete_meals = async (c: Context) => {
  try {
    const db = getDB(c);
    const body = await c.req.json();
    
    // Validate required fields
    const { id } = body;
    if (!id) {
      return c.json({ error: "Missing id" }, 400);
    }

    // Check if meal exists before deleting
    const existingMeal = await db
      .select()
      .from(meals)
      .where(eq(meals.id, id))
      .limit(1);

    if (!existingMeal.length) {
      return c.json({ error: "Meal not found" }, 404);
    }

    // Delete meal from the database
    await db
      .delete(meals)
      .where(eq(meals.id, id));

    return c.json({ 
      message: "Meal deleted successfully",
      deletedId: id
    }, 200);

  } catch (error) {
    console.error("Error deleting meal:", error);
    return c.json({ error: "Failed to delete meal" }, 500);
  }
};