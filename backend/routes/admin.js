const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Post = require("../models/Posts");
const Audit = require('../models/AuditLog')
const { authenticateToken } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/roles')


router.get('/stats',
    authenticateToken,
    requireRole('admin'),
    async (req, res) => {
        const [today, pending, reports] = await Promise.all([
            Post.countDocuments({
                createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
            }),
            Post.countDocuments({ status: "pending" }),
            Post.aggregate([
                { $group: { _id: null, sum: { $sum: "$reportsCount" } } }
            ])
        ])
        res.json({ today, pending, reports: reports?.[0]?.sum ?? 0 })
    })



module.exports = router