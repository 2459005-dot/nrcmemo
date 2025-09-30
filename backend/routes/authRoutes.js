const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/User")
const auth = require('../middlewares/auth')

function makeToken(user) {
    return jwt.sign(
        {
            id: user._id.toString(),
            role: user.role,
            email: user.email
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "7d"
        }
    )
}

router.post("/register", async (req, res) => {
    try {
        const { email, password, displayName, role } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "이메일/비밀번호 필요" })
        }

        const exists = await User.findOne({
            email: email.toLowerCase()
        })

        if (exists) {
            return res.status(400).json({ message: "이미 가입된 이메일" })
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const validRoles = ["user", "admin"]
        const safeRole = validRoles.includes(role) ? role : "user"

        const user = await User.create({
            email,
            displayName,
            passwordHash,
            role: safeRole
        })

        res.status(201).json({ user: user.toSafeJSON() })

    } catch (error) {
        return res.status(500).json({
            message: "회원가입 실패",
            error: error.message
        })

    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({
            email: email.toLowerCase(),
            isActive: true
        })

        if (!user) return res.status(400).json({ message: "이메일이 올바르지 않습니다" })

        const ok = await user.comparePassword(password)

        if (!ok) {
            user.loginAttempts += 1

            if (user.loginAttempts >= 5) {
                user.isActive = false
            }

            await user.save()

            return res.status(400).json({
                message: user.isActive ? "비밀번호가 올바르지 않습니다." : "로그인 시도 횟수 5회 초과로 비활성화됨",
                loginAttempts: user.loginAttempts,
                isActive: user.isActive
            })
        }

        const updated = await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    isLoggined: true,
                    loginAttempts: 0
                }
            },
            { new: true }
        )

        if (!updated) return res.status(500).json({ message: "로그인 상태 갱신 실패" })

        const token = makeToken(updated)

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "lax",
            secure: "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            user: updated.toSafeJSON(),
            token
        })

    } catch (error) {
        return res.status(500).json({
            message: "로그인 실패",
            error: error.message
        })
    }
})

router.get("/me", async (req, res) => {
    try {
        const h = req.headers.authorization || ""

        const token = h.startsWith("Bearer") ? h.slice(7) : null

        if (!token) return res.status(401).json({ message: "인증 필요" })

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(payload.id)

        if (!user) return res.status(404).json({ message: "사용자 없음" })

        res.status(200).json(user.toSafeJSON())

    } catch (error) {
        res.status(401).json({ message: "토큰 무효", error: error.message })
    }
})



module.exports = router