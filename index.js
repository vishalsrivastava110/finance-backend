const express = require('express');
const app = express();

app.use(express.json());

let records = [];

// users for role-based access
const users = {
    admin: "admin123",
    user: "user123"
};

// AUTH middleware
const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const [role, password] = token.split(":");

    if (!users[role] || users[role] !== password) {
        return res.status(403).json({ message: "Forbidden" });
    }

    req.role = role;
    next();
};

app.use(auth);

// CREATE
app.post('/records', (req, res) => {
    const { name, amount, category, type } = req.body;

    if (!name || !type) {
        return res.status(400).json({ message: "Name and type required" });
    }

    const record = {
        id: Date.now(),
        name,
        amount: amount || 0,
        category: category || "general",
        type,
        date: new Date(),
        deleted: false
    };

    records.push(record);
    res.status(201).json(record);
});

// GET ALL + FILTER + PAGINATION
app.get('/records', (req, res) => {
    let result = records.filter(r => !r.deleted);

    if (req.query.type) {
        result = result.filter(r => r.type === req.query.type);
    }

    if (req.query.category) {
        result = result.filter(r => r.category === req.query.category);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const start = (page - 1) * limit;
    const end = start + limit;

    res.json(result.slice(start, end));
});

// GET ONE
app.get('/records/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const record = records.find(r => r.id === id && !r.deleted);

    if (!record) {
        return res.status(404).json({ message: "Not found" });
    }

    res.json(record);
});

// UPDATE (admin only)
app.put('/records/:id', (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ message: "Admin only" });
    }

    const id = parseInt(req.params.id);
    const record = records.find(r => r.id === id && !r.deleted);

    if (!record) {
        return res.status(404).json({ message: "Not found" });
    }

    Object.assign(record, req.body);
    res.json(record);
});

// DELETE (admin only)
app.delete('/records/:id', (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ message: "Admin only" });
    }

    const id = parseInt(req.params.id);
    const record = records.find(r => r.id === id);

    if (!record) {
        return res.status(404).json({ message: "Not found" });
    }

    record.deleted = true;
    res.json({ message: "Soft deleted" });
});

// DASHBOARD
app.get('/dashboard', (req, res) => {
    const active = records.filter(r => !r.deleted);

    const income = active
        .filter(r => r.type === "income")
        .reduce((sum, r) => sum + r.amount, 0);

    const expense = active
        .filter(r => r.type === "expense")
        .reduce((sum, r) => sum + r.amount, 0);

    res.json({
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});