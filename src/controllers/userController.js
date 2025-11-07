const userService = require('../services/userService')

const userController = {
    register: async (req, res) => {
        try {
            const { email, password } = req.body
            const result = await userService.register(email, password)

            return res.status(result.code).json(result)
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error.message)

            return res.status(500).json({
                status: 'error',
                code: 500,
                message: 'Lỗi máy chủ. Vui lòng thử lại sau.',
                data: null,
            })
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const result = await userService.login(email, password)

            return res.status(result.code).json(result)
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error.message)

            return res.status(500).json({
                status: 'error',
                code: 500,
                message: 'Lỗi máy chủ. Vui lòng thử lại sau.',
                data: null,
            })
        }
    },
}

module.exports = userController
