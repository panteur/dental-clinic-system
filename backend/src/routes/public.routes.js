const express = require('express');
const { body } = require('express-validator');
const Patient = require('../models/patient.model');
const Appointment = require('../models/appointment.model');
const { APPOINTMENT_TYPES } = require('../config/constants');
const { AppError } = require('../middleware/error.middleware');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

router.post('/register',
  validate([
    body('dni').trim().notEmpty(),
    body('name').trim().notEmpty(),
    body('last_name').trim().notEmpty(),
    body('phone').trim().notEmpty()
  ]),
  async (req, res, next) => {
    try {
      const { dni, name, last_name, email, phone } = req.body;

      let patient = await Patient.findByDni(dni);
      
      if (!patient) {
        const patientId = await Patient.create({
          dni,
          name,
          last_name,
          email: email || null,
          phone
        });
        patient = await Patient.findById(patientId);
      }

      res.status(201).json({
        message: 'Paciente registrado exitosamente',
        patient
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/appointment',
  validate([
    body('dni').trim().notEmpty(),
    body('name').trim().notEmpty(),
    body('last_name').trim().notEmpty(),
    body('phone').trim().notEmpty(),
    body('dentist_id').isInt(),
    body('service_id').isInt(),
    body('date').isDate(),
    body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  ]),
  async (req, res, next) => {
    try {
      const { dni, name, last_name, email, phone, dentist_id, service_id, date, time, notes } = req.body;

      let patient = await Patient.findByDni(dni);
      
      if (!patient) {
        const patientId = await Patient.create({
          dni,
          name,
          last_name,
          email: email || null,
          phone
        });
        patient = await Patient.findById(patientId);
      }

      const isAvailable = await Appointment.checkAvailability(dentist_id, date, time);
      if (!isAvailable) {
        throw new AppError('El horario seleccionado no está disponible', 400);
      }

      const appointmentId = await Appointment.create({
        patient_id: patient.id,
        dentist_id,
        service_id,
        date,
        time,
        duration: 30,
        type: APPOINTMENT_TYPES.NEW,
        notes: notes || null
      });

      const appointment = await Appointment.findById(appointmentId);

      res.status(201).json({
        message: 'Cita agendada exitosamente',
        appointment,
        patient
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/services', async (req, res, next) => {
  try {
    const Service = require('../models/service.model');
    const services = await Service.findAll({ active: true });
    res.json({ services });
  } catch (error) {
    next(error);
  }
});

router.get('/dentists', async (req, res, next) => {
  try {
    const User = require('../models/user.model');
    const { ROLES } = require('../config/constants');
    const dentists = await User.findAll({ role: ROLES.DENTIST });
    res.json({ dentists });
  } catch (error) {
    next(error);
  }
});

router.get('/slots', async (req, res, next) => {
  try {
    const { dentist_id, date } = req.query;
    
    if (!dentist_id || !date) {
      throw new AppError('Se requiere dentist_id y date', 400);
    }

    const Schedule = require('../models/schedule.model');
    const Appointment = require('../models/appointment.model');
    
    const dayOfWeek = new Date(date).getDay();
    const schedule = await Schedule.findByDay(parseInt(dentist_id), dayOfWeek);
    
    if (!schedule) {
      return res.json({ slots: [], message: 'El dentista no atende este día' });
    }

    const slots = [];
    const startTime = schedule.start_time.split(':').map(Number);
    const endTime = schedule.end_time.split(':').map(Number);
    const breakStart = schedule.break_start ? schedule.break_start.split(':').map(Number) : null;
    const breakEnd = schedule.break_end ? schedule.break_end.split(':').map(Number) : null;

    let currentHour = startTime[0];
    let currentMinute = startTime[1];

    while (currentHour < endTime[0] || (currentHour === endTime[0] && currentMinute < endTime[1])) {
      const isBreak = breakStart && breakEnd && (
        (currentHour > breakStart[0] || (currentHour === breakStart[0] && currentMinute >= breakStart[1])) &&
        (currentHour < breakEnd[0] || (currentHour === breakEnd[0] && currentMinute < breakEnd[1]))
      );

      if (!isBreak) {
        const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        
        const isAvailable = await Appointment.checkAvailability(
          parseInt(dentist_id), 
          date, 
          timeStr
        );
        
        if (isAvailable) {
          slots.push(timeStr);
        }
      }

      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour++;
      }
    }

    res.json({ slots, schedule });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
