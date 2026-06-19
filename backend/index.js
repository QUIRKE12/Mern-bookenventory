require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const admin = require('firebase-admin');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Firebase Admin init
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    })
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => console.error("MongoDB error:", err));

// ===== SCHEMAS =====

// ── Product ──────────────────────────────────────────────────────────────────
const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    brandName: { type: String, required: true },
    imageURL: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    branch: { type: String, enum: ["Bujumbura HQ", "Kampala", "Uganda", "DRC"], required: true },

    // ── NEW: stock tracking ──────────────────────────────────────────────────
    stock: { type: Number, default: 0, min: 0 },
    minStockLevel: { type: Number, default: 10 },  // alert threshold
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

// ── User ─────────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photoURL: { type: String },
    role: { type: String, enum: ["owner", "branch_manager", "sales_manager", "warehouse_manager", "cashier", "employee", "customer"], default: "customer" },
    branch: { type: String, enum: ["Bujumbura HQ", "Kampala", "Uganda", "DRC", "all"], default: "all" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// ── Order ─────────────────────────────────────────────────────────────────────
const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    branch: { type: String, enum: ["Bujumbura HQ", "Kampala", "Uganda", "DRC"], required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            productName: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true, default: 1 },
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "processing", "delivered", "cancelled"], default: "pending" },
    paymentStatus: { type: String, enum: ["unpaid", "pending_approval", "paid"], default: "unpaid" },paymentScreenshot: { type: String, default: "" },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

// ── NEW: Branch ───────────────────────────────────────────────────────────────
const branchSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, enum: ["Bujumbura HQ", "Kampala", "Uganda", "DRC"] },
    managerName: { type: String, default: "" },
    managerEmail: { type: String, default: "" },
    location: { type: String, default: "" },
    phone: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

const Branch = mongoose.model("Branch", branchSchema);

// ── NEW: StockMovement (audit log for stock in/out) ───────────────────────────
const stockMovementSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    branch: { type: String, required: true },
    type: { type: String, enum: ["in", "out"], required: true },
    quantity: { type: Number, required: true, min: 1 },
    reason: { type: String, default: "" },        // e.g. "Restock", "Sale", "Damaged"
    performedBy: { type: String, required: true }, // user email
}, { timestamps: true });

const StockMovement = mongoose.model("StockMovement", stockMovementSchema);

// ===== MIDDLEWARE =====

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized - no token" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized - invalid token" });
    }
};

const checkRole = (...roles) => async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ error: "Forbidden - insufficient role" });
        }
        req.dbUser = user;
        next();
    } catch (error) {
        return res.status(500).json({ error: "Role check failed" });
    }
};

const checkBranch = async (req, res, next) => {
    const user = req.dbUser;
    const targetBranch = req.body.branch || req.query.branch;
    if (user.role === "owner") return next();
    if (user.branch === "all") return next();
    if (targetBranch && user.branch !== targetBranch) {
        return res.status(403).json({ error: "Forbidden - wrong branch" });
    }
    next();
};

// ===== ROUTES =====

app.get("/", (req, res) => {
    res.send("GIGO COMPANY Backend is running!");
});

// ===== PRODUCT ROUTES =====

app.post("/upload-product", verifyToken, checkRole("owner", "branch_manager"), checkBranch, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, message: "Product uploaded successfully", product: newProduct });
    } catch (error) {
        res.status(400).json({ error: "Failed to add product", details: error.message });
    }
});

app.get("/all-products", async (req, res) => {
    try {
        const query = {};
        if (req.query?.category) query.category = req.query.category;
        if (req.query?.branch) query.branch = req.query.branch;

        // NEW: name search
        if (req.query?.search) {
            query.productName = { $regex: req.query.search, $options: "i" };
        }

        // NEW: pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const total = await Product.countDocuments(query);
        const products = await Product.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

        res.json({ products, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch product" });
    }
});

app.patch("/product/:id", verifyToken, checkRole("owner", "branch_manager"), checkBranch, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
        res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: "Failed to update product" });
    }
});

app.delete("/product/:id", verifyToken, checkRole("owner", "branch_manager"), checkBranch, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete product" });
    }
});

// ===== USER ROUTES =====

app.post("/users", async (req, res) => {
    try {
        const { name, email, photoURL } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ name, email, photoURL });
            await user.save();
        }
        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ error: "Failed to create/sync user", details: error.message });
    }
});

app.get("/users", verifyToken, checkRole("owner", "branch_manager"), async (req, res) => {
    try {
        const query = {};
        if (req.query?.role) query.role = req.query.role;
        if (req.query?.branch) query.branch = req.query.branch;
        if (req.query?.status) query.status = req.query.status;

        // NEW: pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const total = await User.countDocuments(query);
        const users = await User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

        res.json({ users, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.get("/users/:email", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// Only owner can change roles
app.patch("/users/:id", verifyToken, checkRole("owner"), async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

app.delete("/users/:id", verifyToken, checkRole("owner"), async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// ===== ORDER ROUTES =====

app.post("/orders", verifyToken, async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });
    } catch (error) {
        res.status(400).json({ error: "Failed to place order", details: error.message });
    }
});

app.get("/orders", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const query = {};

        if (user.role === "customer") {
            query.customerEmail = user.email;
        } else if (user.role === "branch_manager" && user.branch !== "all") {
            query.branch = user.branch;
        }

        if (req.query?.status) query.status = req.query.status;
        if (req.query?.branch && user.role === "owner") query.branch = req.query.branch;

        // NEW: date range filter
        if (req.query?.from || req.query?.to) {
            query.createdAt = {};
            if (req.query.from) query.createdAt.$gte = new Date(req.query.from);
            if (req.query.to) query.createdAt.$lte = new Date(req.query.to);
        }

        // NEW: pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const total = await Order.countDocuments(query);
        const orders = await Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.json({ orders, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

app.get("/orders/:id", verifyToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch order" });
    }
});
// Customer cancel order
app.patch("/orders/:id/cancel", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.customerEmail !== user.email) return res.status(403).json({ error: "Forbidden" });
    if (order.status !== "pending") return res.status(400).json({ error: "Can only cancel pending orders" });
    order.status = "cancelled";
    await order.save();
    res.json({ success: true, message: "Order cancelled", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});
// Customer marks as paid
app.patch("/orders/:id/mark-paid", verifyToken, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { paymentStatus: "pending_approval", paymentScreenshot: req.body.paymentScreenshot || "" } },
            { new: true }
        );

// Manager/owner approves payment
app.patch("/orders/:id/approve-payment", verifyToken, checkRole("owner", "branch_manager"), async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { paymentStatus: "paid" } },
            { new: true }
        );
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json({ success: true, message: "Payment approved", order });
    } catch (error) {
        res.status(500).json({ error: "Failed to approve payment" });
    }
});

app.patch("/orders/:id", verifyToken, checkRole("owner", "branch_manager"), async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedOrder) return res.status(404).json({ error: "Order not found" });
        res.json({ success: true, order: updatedOrder });
    } catch (error) {
        res.status(500).json({ error: "Failed to update order" });
    }
});

app.delete("/orders/:id", verifyToken, checkRole("owner", "branch_manager"), async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ success: false, message: "Order not found" });
        res.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete order" });
    }
});

// ===== NEW: INVENTORY / STOCK ROUTES =====

// Stock In — add stock to a product
app.post("/inventory/stock-in", verifyToken, checkRole("owner", "branch_manager", "warehouse_manager"), async (req, res) => {
    try {
        const { productId, quantity, reason } = req.body;
        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({ error: "productId and quantity (min 1) are required" });
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            { $inc: { stock: quantity } },
            { new: true }
        );
        if (!product) return res.status(404).json({ error: "Product not found" });

        // Log the movement
        await StockMovement.create({
            productId,
            productName: product.productName,
            branch: product.branch,
            type: "in",
            quantity,
            reason: reason || "Restock",
            performedBy: req.user.email,
        });

        res.json({ success: true, message: `Added ${quantity} units to ${product.productName}`, product });
    } catch (error) {
        res.status(500).json({ error: "Stock-in failed", details: error.message });
    }
});

// Stock Out — remove stock from a product
app.post("/inventory/stock-out", verifyToken, checkRole("owner", "branch_manager", "warehouse_manager"), async (req, res) => {
    try {
        const { productId, quantity, reason } = req.body;
        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({ error: "productId and quantity (min 1) are required" });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });
        if (product.stock < quantity) {
            return res.status(400).json({ error: `Insufficient stock. Available: ${product.stock}` });
        }

        product.stock -= quantity;
        await product.save();

        await StockMovement.create({
            productId,
            productName: product.productName,
            branch: product.branch,
            type: "out",
            quantity,
            reason: reason || "Sale",
            performedBy: req.user.email,
        });

        res.json({ success: true, message: `Removed ${quantity} units from ${product.productName}`, product });
    } catch (error) {
        res.status(500).json({ error: "Stock-out failed", details: error.message });
    }
});

// Get low-stock products (below their minStockLevel)
app.get("/inventory/low-stock", verifyToken, checkRole("owner", "branch_manager", "warehouse_manager"), async (req, res) => {
    try {
        const query = { $expr: { $lte: ["$stock", "$minStockLevel"] } };
        if (req.query?.branch) query.branch = req.query.branch;

        const products = await Product.find(query).sort({ stock: 1 });
        res.json({ count: products.length, products });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch low-stock products" });
    }
});

// Get stock movement history
app.get("/inventory/movements", verifyToken, checkRole("owner", "branch_manager", "warehouse_manager"), async (req, res) => {
    try {
        const query = {};
        if (req.query?.productId) query.productId = req.query.productId;
        if (req.query?.branch) query.branch = req.query.branch;
        if (req.query?.type) query.type = req.query.type;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const total = await StockMovement.countDocuments(query);
        const movements = await StockMovement.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.json({ movements, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch movements" });
    }
});

// ===== NEW: BRANCH ROUTES =====

// Seed or create a branch
app.post("/branches", verifyToken, checkRole("owner"), async (req, res) => {
    try {
        const branch = new Branch(req.body);
        await branch.save();
        res.status(201).json({ success: true, branch });
    } catch (error) {
        res.status(400).json({ error: "Failed to create branch", details: error.message });
    }
});

// Get all branches with live stats
app.get("/branches", async (req, res) => {
    try {
        const branches = await Branch.find();

        // Attach live stats from orders + users
        const enriched = await Promise.all(branches.map(async (b) => {
            const [orderCount, revenue, staffCount] = await Promise.all([
                Order.countDocuments({ branch: b.name }),
                Order.aggregate([
                    { $match: { branch: b.name, paymentStatus: "paid" } },
                    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
                ]),
                User.countDocuments({ branch: b.name, role: { $ne: "customer" } }),
            ]);

            return {
                ...b.toObject(),
                stats: {
                    orderCount,
                    totalRevenue: revenue[0]?.total || 0,
                    staffCount,
                },
            };
        }));

        res.json(enriched);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch branches" });
    }
});

app.patch("/branches/:id", verifyToken, checkRole("owner"), async (req, res) => {
    try {
        const updated = await Branch.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!updated) return res.status(404).json({ error: "Branch not found" });
        res.json({ success: true, branch: updated });
    } catch (error) {
        res.status(500).json({ error: "Failed to update branch" });
    }
});

app.delete("/branches/:id", verifyToken, checkRole("owner"), async (req, res) => {
    try {
        const deleted = await Branch.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Branch not found" });
        res.json({ success: true, message: "Branch deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete branch" });
    }
});

// ===== NEW: DASHBOARD STATS ROUTE =====

app.get("/stats/dashboard", verifyToken, checkRole("owner", "branch_manager"), async (req, res) => {
    try {
        const user = req.dbUser;
        const branchFilter = (user.role === "owner" || user.branch === "all") ? {} : { branch: user.branch };

        // Date ranges
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Total revenue this month (paid orders)
        const revenueThisMonth = await Order.aggregate([
            { $match: { ...branchFilter, paymentStatus: "paid", createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        const revenueLastMonth = await Order.aggregate([
            { $match: { ...branchFilter, paymentStatus: "paid", createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        // Order counts
        const ordersThisMonth = await Order.countDocuments({ ...branchFilter, createdAt: { $gte: startOfMonth } });
        const ordersLastMonth = await Order.countDocuments({ ...branchFilter, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } });

        // Products and low stock
        const totalProducts = await Product.countDocuments(branchFilter);
        const lowStockProducts = await Product.countDocuments({
            ...branchFilter,
            $expr: { $lte: ["$stock", "$minStockLevel"] },
        });

        // Monthly revenue for the last 6 months
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const monthlyRevenue = await Order.aggregate([
            { $match: { ...branchFilter, paymentStatus: "paid", createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    total: { $sum: "$totalAmount" },
                    count: { $sum: 1 },
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Top 5 best-selling products this month
        const bestSellers = await Order.aggregate([
            { $match: { ...branchFilter, createdAt: { $gte: startOfMonth } } },
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.productName",
                    totalSold: { $sum: "$products.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
        ]);

        // Recent 5 orders
        const recentOrders = await Order.find(branchFilter).sort({ createdAt: -1 }).limit(5);

        // Revenue delta %
        const revThis = revenueThisMonth[0]?.total || 0;
        const revLast = revenueLastMonth[0]?.total || 0;
        const revDelta = revLast > 0 ? (((revThis - revLast) / revLast) * 100).toFixed(1) : null;

        const ordDelta = ordersLastMonth > 0
            ? (((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100).toFixed(1)
            : null;

        res.json({
            success: true,
            kpis: {
                revenueThisMonth: revThis,
                revenueDelta: revDelta,          // e.g. "+12.4" or "-3.2"
                ordersThisMonth,
                ordersDelta: ordDelta,
                totalProducts,
                lowStockAlerts: lowStockProducts,
            },
            monthlyRevenue,   // [{_id: {year, month}, total, count}]
            bestSellers,      // [{_id: productName, totalSold, totalRevenue}]
            recentOrders,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate dashboard stats", details: error.message });
    }
});

// ===== NEW: REPORTS =====

// Weekly report (original, kept)
app.get("/report/weekly", verifyToken, checkRole("owner", "branch_manager"), async (req, res) => {
    try {
        const user = req.dbUser;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const branches = (user.role === "owner" || user.branch === "all")
            ? ["Bujumbura HQ", "Kampala", "Uganda", "DRC"]
            : [user.branch];

        const report = {};
        for (const branch of branches) {
            const orders = await Order.find({ branch, createdAt: { $gte: sevenDaysAgo }, paymentStatus: "paid" });
            const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
            const orderCount = orders.length;
            const productCount = {};
            orders.forEach(order => {
                order.products.forEach(p => {
                    productCount[p.productName] = (productCount[p.productName] || 0) + p.quantity;
                });
            });
            const topProducts = Object.entries(productCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, quantity]) => ({ name, quantity }));
            report[branch] = { totalRevenue, orderCount, topProducts };
        }
        res.json({ success: true, period: "last 7 days", report });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate report" });
    }
});

// NEW: Daily report
app.get("/report/daily", verifyToken, checkRole("owner", "branch_manager"), async (req, res) => {
    try {
        const user = req.dbUser;
        const targetDate = req.query.date ? new Date(req.query.date) : new Date();
        const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        const branchFilter = (user.role === "owner") ? {} : { branch: user.branch };

        const orders = await Order.find({
            ...branchFilter,
            createdAt: { $gte: startOfDay, $lt: endOfDay },
        });

        const totalRevenue = orders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + o.totalAmount, 0);
        const byBranch = {};
        orders.forEach(o => {
            if (!byBranch[o.branch]) byBranch[o.branch] = { orderCount: 0, revenue: 0 };
            byBranch[o.branch].orderCount++;
            if (o.paymentStatus === "paid") byBranch[o.branch].revenue += o.totalAmount;
        });

        res.json({
            success: true,
            date: startOfDay,
            summary: { totalOrders: orders.length, totalRevenue, byBranch },
            orders,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate daily report" });
    }
});

// NEW: Monthly report
app.get("/report/monthly", verifyToken, checkRole("owner", "branch_manager"), async (req, res) => {
    try {
        const user = req.dbUser;
        const now = new Date();
        const year = parseInt(req.query.year) || now.getFullYear();
        const month = parseInt(req.query.month) || (now.getMonth() + 1); // 1-12

        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59);

        const branchFilter = (user.role === "owner") ? {} : { branch: user.branch };

        const orders = await Order.find({
            ...branchFilter,
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        });

        const paidOrders = orders.filter(o => o.paymentStatus === "paid");
        const totalRevenue = paidOrders.reduce((s, o) => s + o.totalAmount, 0);

        // Revenue by branch
        const byBranch = {};
        orders.forEach(o => {
            if (!byBranch[o.branch]) byBranch[o.branch] = { orderCount: 0, revenue: 0 };
            byBranch[o.branch].orderCount++;
            if (o.paymentStatus === "paid") byBranch[o.branch].revenue += o.totalAmount;
        });

        // Top products
        const productCount = {};
        paidOrders.forEach(order => {
            order.products.forEach(p => {
                if (!productCount[p.productName]) productCount[p.productName] = { sold: 0, revenue: 0 };
                productCount[p.productName].sold += p.quantity;
                productCount[p.productName].revenue += p.price * p.quantity;
            });
        });
        const topProducts = Object.entries(productCount)
            .sort((a, b) => b[1].sold - a[1].sold)
            .slice(0, 10)
            .map(([name, data]) => ({ name, ...data }));

        res.json({
            success: true,
            period: { year, month },
            summary: {
                totalOrders: orders.length,
                paidOrders: paidOrders.length,
                totalRevenue,
                byBranch,
            },
            topProducts,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate monthly report" });
    }
});

// NEW: Branch performance comparison
app.get("/report/branch-performance", verifyToken, checkRole("owner"), async (req, res) => {
    try {
        const branches = ["Bujumbura HQ", "Kampala", "Uganda", "DRC"];
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const performance = await Promise.all(branches.map(async (branch) => {
            const [orders, revenue, staff, lowStock] = await Promise.all([
                Order.countDocuments({ branch, createdAt: { $gte: startOfMonth } }),
                Order.aggregate([
                    { $match: { branch, paymentStatus: "paid", createdAt: { $gte: startOfMonth } } },
                    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
                ]),
                User.countDocuments({ branch, role: { $ne: "customer" }, status: "active" }),
                Product.countDocuments({ branch, $expr: { $lte: ["$stock", "$minStockLevel"] } }),
            ]);

            return {
                branch,
                ordersThisMonth: orders,
                revenueThisMonth: revenue[0]?.total || 0,
                activeStaff: staff,
                lowStockAlerts: lowStock,
            };
        }));

        res.json({ success: true, performance });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate branch performance report" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
