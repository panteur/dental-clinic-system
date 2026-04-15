const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { AppError } = require('../middleware/error.middleware');

class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password, name, role, phone, specialty } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new AppError('El email ya está registrado', 400);
      }

      const userId = await User.create({
        email,
        password,
        name,
        role: role || 'recepcionista',
        phone,
        specialty
      });

      const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: userId,
          email,
          name,
          role: role || 'recepcionista'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        throw new AppError('Credenciales inválidas', 401);
      }

      const isValidPassword = await User.comparePassword(password, user.password);
      if (!isValidPassword) {
        throw new AppError('Credenciales inválidas', 401);
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        message: 'Login exitoso',
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        throw new AppError('Usuario no encontrado', 404);
      }
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      const user = await User.findByEmail(req.user.email);
      const isValidPassword = await User.comparePassword(currentPassword, user.password);
      
      if (!isValidPassword) {
        throw new AppError('Contraseña actual incorrecta', 400);
      }

      await User.update(req.user.id, { password: newPassword });
      
      res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
