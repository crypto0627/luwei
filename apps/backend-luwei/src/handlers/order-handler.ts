import { Context } from "hono";
import { getDB } from "../db";
import { users, orders, orderItems, meals } from "../db/schema";
import { eq, inArray } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export const checkout = async (c: Context) => {
  try {
    const db = getDB(c);
    const token = getCookie(c, "auth_token");
    if (!token) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Verify JWT token and get user ID
    const payload = await verify(token, c.env.JWT_SECRET);
    const userId = payload.sub;
    
    if (!userId) {
      return c.json({ error: "Invalid token" }, 401);
    }

    // Find user by ID
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const body = await c.req.json();
    const items = body.items;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return c.json({ error: "Invalid order items" }, 400);
    }

    // Validate all meal IDs exist
    const mealIds = items.map(item => item.meal.id);
    const existingMeals = await db
      .select()
      .from(meals)
      .where(inArray(meals.id, mealIds));

    if (existingMeals.length !== mealIds.length) {
      return c.json({ error: "Some meals do not exist" }, 400);
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.meal.price * item.quantity);
    }, 0);

    // Create order
    const orderId = uuidv4();
    await db.insert(orders).values({
      id: orderId,
      userId: user.id,
      status: "pending",
      totalAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create order items
    const orderItemsData = items.map(item => ({
      id: uuidv4(),
      orderId,
      mealId: item.meal.id,
      quantity: item.quantity,
      price: item.meal.price,
      createdAt: new Date(),
    }));

    await db.insert(orderItems).values(orderItemsData);

    return c.json({
      message: "Order created successfully",
      orderId,
      totalAmount,
    });
  } catch (error) {
    console.error("Error in checkout:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const getOrders = async (c: Context) => {
  try {
    const db = getDB(c);
    const token = getCookie(c, "auth_token");
    if (!token) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Verify JWT token and get user ID
    const payload = await verify(token, c.env.JWT_SECRET);
    const userId = payload.sub;
    
    if (!userId) {
      return c.json({ error: "Invalid token" }, 401);
    }

    // Get all orders for the user with their items
    const userOrders = await db
      .select({
        order: orders,
        items: orderItems,
        meal: meals,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .leftJoin(meals, eq(orderItems.mealId, meals.id))
      .where(eq(orders.userId, userId))
      .orderBy(orders.createdAt);

    // Group orders and their items
    const ordersMap = new Map();
    userOrders.forEach((row) => {
      if (!ordersMap.has(row.order.id)) {
        ordersMap.set(row.order.id, {
          ...row.order,
          items: [],
        });
      }
      if (row.items && row.meal) {
        ordersMap.get(row.order.id).items.push({
          ...row.items,
          meal: row.meal,
        });
      }
    });

    return c.json({
      orders: Array.from(ordersMap.values()),
    });
  } catch (error) {
    console.error("Error in getOrders:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};