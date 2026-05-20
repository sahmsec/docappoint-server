const express = require('express');
const router = express.Router();
const authSession = require('../middleware/authSession');
const Appointment = require('../models/Appointment');

// GET all appointments for logged-in user (protected)
router.get('/', authSession, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userEmail: req.user.email })
      .populate('doctorId', 'name specialty image hospital')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create appointment (protected)
router.post('/', authSession, async (req, res) => {
  try {
    const { doctorId, doctorName, patientName, gender, phone, appointmentDate, appointmentTime } = req.body;

    const appointment = await Appointment.create({
      userEmail: req.user.email,
      userId: req.user._id.toString(),
      doctorId,
      doctorName,
      patientName,
      gender,
      phone,
      appointmentDate,
      appointmentTime
    });

    res.status(201).json({ success: true, message: 'Appointment booked successfully!', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update appointment (protected) - user can only update their own, doctorName and userEmail are read-only
router.put('/:id', authSession, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ 
      _id: req.params.id, 
      userEmail: req.user.email 
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found or unauthorized' });
    }

    // Prevent changing doctorName and userEmail
    const { patientName, gender, phone, appointmentDate, appointmentTime } = req.body;

    appointment.patientName = patientName || appointment.patientName;
    appointment.gender = gender || appointment.gender;
    appointment.phone = phone || appointment.phone;
    appointment.appointmentDate = appointmentDate || appointment.appointmentDate;
    appointment.appointmentTime = appointmentTime || appointment.appointmentTime;

    await appointment.save();

    res.json({ success: true, message: 'Appointment updated successfully!', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE appointment (protected)
router.delete('/:id', authSession, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({ 
      _id: req.params.id, 
      userEmail: req.user.email 
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found or unauthorized' });
    }

    res.json({ success: true, message: 'Appointment deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
