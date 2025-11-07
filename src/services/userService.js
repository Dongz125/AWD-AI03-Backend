const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { prisma } = require('../config/prismaClient.js');

const userService = {
    register: async (email, password) => {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!email || !password) {
                return {
                    status: 'error',
                    code: 400,
                    data: null,
                    message: 'Email và mật khẩu là bắt buộc',
                }
            }

            // Kiểm tra email tồn tại
            const existingUser = await prisma.user.findUnique({
                where: { email },
            })
            if (existingUser) {
                return {
                    status: 'error',
                    code: 409, // Conflict
                    data: null,
                    message: 'Email đã tồn tại',
                }
            }

            // Hash mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10)

            // Tạo user mới
            await prisma.user.create({
                data: { email, password: hashedPassword },
                select: { id: true, email: true, createdAt: true },
            })

            return {
                status: 'success',
                code: 200,
                data: null,
                message: 'Đăng ký thành công',
            }
        } catch (error) {
            console.error('Lỗi khi đăng ký user:', error)
            return {
                status: 'error',
                code: 500,
                data: null,
                message: 'Đã xảy ra lỗi trong quá trình đăng ký',
            }
        }
    },

    login: async (email, password) => {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!email || !password) {
                return {
                    status: 'error',
                    code: 400,
                    data: null,
                    message: 'Email và mật khẩu là bắt buộc',
                }
            }

            // Tìm user theo email
            const user = await prisma.user.findUnique({ where: { email } })
            if (!user) {
                return {
                    status: 'error',
                    code: 404,
                    data: null,
                    message: 'Email hoặc mật khẩu không chính xác',
                }
            }

            // So sánh mật khẩu
            const isPasswordValid = await bcrypt.compare(
                password,
                user.password,
            )
            if (!isPasswordValid) {
                return {
                    status: 'error',
                    code: 404,
                    data: null,
                    message: 'Email hoặc mật khẩu không chính xác',
                }
            }

            // Tạo JWT token chỉ chứa thông tin cần thiết
            const { password: _, ...userData } = user
            const token = jwt.sign(userData, process.env.JWT_SECRET, {
                expiresIn: '7d',
            })

            // Trả về kết quả
            return {
                status: 'success',
                code: 200,
                data: token,
                message: 'Đăng nhập thành công',
            }
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error)
            return {
                status: 'error',
                code: 500,
                data: null,
                message: 'Đã xảy ra lỗi trong quá trình đăng nhập',
            }
        }
    },
}

module.exports = userService
