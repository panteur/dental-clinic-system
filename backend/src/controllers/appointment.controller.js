const Appointment = require('../models/appointment.model');
const { STATUS, APPOINTMENT_TYPES } = require('../config/constants');
const { AppError } = require('../middleware/error.middleware');
const emailService = require('../services/email.service');

class AppointmentController {
  static async getAll(req, res, next) {
    try {
      const { dentist_id, patient_id, status, date, date_from, date_to, limit } = req.query;
      const appointments = await Appointment.findAll({
        dentist_id,
        patient_id,
        status,
        date,
        date_from,
        date_to,
        limit
      });
      res.json({ appointments });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
        throw new AppError('Cita no encontrada', 404);
      }
      res.json({ appointment });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { patient_id, dentist_id, service_id, date, time, duration, type, notes } = req.body;

      const isAvailable = await Appointment.checkAvailability(dentist_id, date, time);
      if (!isAvailable) {
        throw new AppError('El horario no está disponible', 400);
      }

      const appointmentId = await Appointment.create({
        patient_id,
        dentist_id,
        service_id,
        date,
        time,
        duration,
        type: type || APPOINTMENT_TYPES.NEW,
        notes
      });

      const appointment = await Appointment.findById(appointmentId);
      res.status(201).json({ message: 'Cita creada', appointment });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
        throw new AppError('Cita no encontrada', 404);
      }

      const { dentist_id, date, time } = req.body;
      if (dentist_id && date && time) {
        const isAvailable = await Appointment.checkAvailability(
          dentist_id, 
          date, 
          time, 
          parseInt(req.params.id)
        );
        if (!isAvailable) {
          throw new AppError('El horario no está disponible', 400);
        }
      }

      await Appointment.update(req.params.id, req.body);
      const updatedAppointment = await Appointment.findById(req.params.id);

      if (req.body.date || req.body.time) {
        emailService.sendAppointmentReschedule(updatedAppointment, updatedAppointment);
      }

      res.json({ message: 'Cita actualizada', appointment: updatedAppointment });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const validStatuses = Object.values(STATUS);
      
      if (!validStatuses.includes(status)) {
        throw new AppError('Estado inválido', 400);
      }

      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
        throw new AppError('Cita no encontrada', 404);
      }

      await Appointment.updateStatus(req.params.id, status);
      const updatedAppointment = await Appointment.findById(req.params.id);

      if (status === STATUS.CANCELLED) {
        emailService.sendAppointmentCancellation(updatedAppointment, updatedAppointment);
      }

      res.json({ message: 'Estado actualizado', appointment: updatedAppointment });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
        throw new AppError('Cita no encontrada', 404);
      }

      await Appointment.delete(req.params.id);
      res.json({ message: 'Cita eliminada' });
    } catch (error) {
      next(error);
    }
  }

  static async getByDateRange(req, res, next) {
    try {
      const { dentist_id, start_date, end_date } = req.query;
      
      if (!start_date || !end_date) {
        throw new AppError('Se requiere start_date y end_date', 400);
      }

      const appointments = await Appointment.getByDateRange({ 
        dentist_id: dentist_id || null, 
        start_date, 
        end_date 
      });
      res.json({ appointments });
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req, res, next) {
    try {
      const { dentist_id, date_from, date_to } = req.query;
      const stats = await Appointment.getStats({ dentist_id, date_from, date_to });
      res.json({ stats });
    } catch (error) {
      next(error);
    }
  }

  static async getByDate(req, res, next) {
    try {
      const { dentist_id, date } = req.query;
      
      if (!date) {
        throw new AppError('Se requiere date', 400);
      }

      const appointments = await Appointment.findAll({ dentist_id, date });
      res.json({ appointments });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AppointmentController;
