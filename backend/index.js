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

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    brandName: { type: String, required: true },
    imageURL: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    branch: { type: String, enum: ["Bujumbura HQ", "Kampala", "Uganda", "DRC"], required: true },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photoURL: { type: String },
    role: { type: String, enum: ["owner", "branch_manager", "customer"], default: "customer" },
    branch: { type: String, enum: ["Bujumbura HQ", "Kampala", "Uganda", "DRC", "all"], default: "all" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

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
    paymentStatus: { type: String, enum: ["unpaid", "pending_approval", "paid"], default: "unpaid" },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

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
        const products = await Product.find(query);
        res.json(products);
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
        const users = await User.find();
        res.json(users);
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

        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
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

// Customer marks as paid
app.patch("/orders/:id/mark-paid", verifyToken, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { paymentStatus: "pending_approval" } },
            { new: true }
        );
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json({ success: true, message: "Payment marked, awaiting approval", order });
    } catch (error) {
        res.status(500).json({ error: "Failed to mark payment" });
    }
});

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

// ===== WEEKLY REPORT =====

app.get("/report/weekly", verifyToken, checkRole("owner", "branch_manager"), async (req, res) => {
    try {
        const user = req.dbUser;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const branches = (user.role === "owner" || user.branch === "Bujumbura HQ")
            ? ["Bujumbura HQ", "Kampala", "Uganda", "DRC"]
            : [user.branch];

        const report = {};

        for (const branch of branches) {
            const orders = await Order.find({
                branch,
                createdAt: { $gte: sevenDaysAgo },
                paymentStatus: "paid",
            });

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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
