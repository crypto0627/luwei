import { Context } from "hono";
import { getDB } from "../db";
import { users, orders, orderItems, meals } from "../db/schema";
import { eq, inArray } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { EmailService } from "../services/email-service";

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
      .where(eq(users.id, userId as string))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const body = await c.req.json();
    const items = body.items;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return c.json({ error: "購物車是空的，無法結帳" }, 400);
    }

    // Validate all meal IDs exist and check availability
    const mealIds = items.map(item => item.meal.id);
    const existingMeals = await db
      .select()
      .from(meals)
      .where(inArray(meals.id, mealIds));

    if (existingMeals.length !== mealIds.length) {
      return c.json({ error: "部分商品不存在" }, 400);
    }

    // Check if any meal is not available
    const unavailableMeals = existingMeals.filter(meal => !meal.isAvailable);
    if (unavailableMeals.length > 0) {
      return c.json({ 
        error: "部分商品已售完", 
        unavailableMeals: unavailableMeals.map(meal => meal.name)
      }, 400);
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

    // Send order confirmation email
    try {
      const emailService = EmailService.getInstance(c.env.RESEND_API_KEY);
      await emailService.sendOrderConfirmationEmail(
        user.email,
        user.name,
        orderId,
        items,
        totalAmount
      );
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
    }

    return c.json({
      message: "訂單建立成功",
      orderId,
      totalAmount,
    });
  } catch (error) {
    console.error("Error in checkout:", error);
    return c.json({ error: "系統錯誤" }, 500);
  }
};

export const getOrders = async (c: Context) => {
  try {
    const db = getDB(c);
    const userId = c.get("jwtPayload").sub;

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

export const getAllOrders = async (c: Context) => {
  try {
    const db = getDB(c);
    const token = getCookie(c, "auth_token");
    if (!token) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get all orders with their items
    const allOrders = await db
      .select({
        order: orders,
        items: orderItems,
        meal: meals,
        user: users,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .leftJoin(meals, eq(orderItems.mealId, meals.id))
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(orders.createdAt);

    // Group orders and their items
    const ordersMap = new Map();
    allOrders.forEach((row) => {
      if (!ordersMap.has(row.order.id)) {
        ordersMap.set(row.order.id, {
          ...row.order,
          items: [],
          user: row.user,
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
    console.error("Error in getAllOrders:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const deleteOrder = async (c: Context) => {
  try {
    const db = getDB(c);
    const token = getCookie(c, "auth_token");
    if (!token) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const payload = await verify(token, c.env.JWT_SECRET);
    const userId = payload.sub;

    const body = await c.req.json();
    const { orderId } = body;

    if (!orderId) {
      return c.json({ error: "Order ID is required" }, 400);
    }

    // First, find the user associated with the order to get their email and name
    const orderData = await db
      .select({
        userEmail: users.email,
        userName: users.name,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(eq(orders.id, orderId))
      .limit(1)
      .then(rows => rows[0]);

    if (!orderData || !orderData.userEmail || !orderData.userName) {
      return c.json({ error: "Order or user data not found" }, 404);
    }

    // Update order status to cancelled
    await db
      .update(orders)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    // Send status update email
    try {
      const emailService = EmailService.getInstance(c.env.RESEND_API_KEY);
      await emailService.sendOrderStatusUpdateEmail(
        orderData.userEmail,
        orderData.userName,
        orderId,
        "cancelled"
      );
    } catch (emailError) {
      console.error("Failed to send order cancellation email:", emailError);
    }

    return c.json({
      message: "Order cancelled successfully",
      orderId,
    });
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const completeOrder = async (c: Context) => {
  try {
    const db = getDB(c);
    const token = getCookie(c, "auth_token");
    if (!token) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { orderId, status = "completed" } = body;

    if (!orderId) {
      return c.json({ error: "Order ID is required" }, 400);
    }
    
    if (status !== 'completed' && status !== 'paid') {
      return c.json({ error: "Invalid status provided" }, 400);
    }

    // Find user associated with the order for the email
    const orderData = await db
      .select({
        userEmail: users.email,
        userName: users.name,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(eq(orders.id, orderId))
      .limit(1)
      .then(rows => rows[0]);

    if (!orderData || !orderData.userEmail || !orderData.userName) {
      return c.json({ error: "Order or user data not found" }, 404);
    }

    // Update order status
    await db
      .update(orders)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    // Send status update email
    try {
      const emailService = EmailService.getInstance(c.env.RESEND_API_KEY);
      await emailService.sendOrderStatusUpdateEmail(
        orderData.userEmail,
        orderData.userName,
        orderId,
        status
      );
    } catch (emailError) {
      console.error(`Failed to send order ${status} email:`, emailError);
    }

    return c.json({
      message: `Order ${status === "paid" ? "marked as paid" : "completed"} successfully`,
      orderId,
    });
  } catch (error) {
    console.error("Error in completeOrder:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};