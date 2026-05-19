const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  userId: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, required: true },
  patientName: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
