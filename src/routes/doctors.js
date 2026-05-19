const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// GET all doctors (public)
router.get('/', async (req, res) => {
  try {
    const { search, sort } = req.query;
    let query = {};

    // Search by doctor name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let doctors = await Doctor.find(query);

    // Sorting
    if (sort === 'rating') {
      doctors = doctors.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'fee-low') {
      doctors = doctors.sort((a, b) => a.fee - b.fee);
    } else if (sort === 'fee-high') {
      doctors = doctors.sort((a, b) => b.fee - a.fee);
    }

    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single doctor (public)
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Seed demo doctors (for initial setup)
router.post('/seed', async (req, res) => {
  try {
    const demoDoctors = [
      {
        name: 'Dr. Ayesha Rahman',
        specialty: 'Cardiologist',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
        experience: '10 years',
        availability: ['09:00 AM - 12:00 PM', '04:00 PM - 07:00 PM'],
        description: 'Highly experienced cardiologist specializing in heart diseases, preventive care, and patient-centered treatment.',
        hospital: 'Labaid Cardiac Hospital',
        location: 'Dhanmondi, Dhaka',
        fee: 800,
        rating: 4.9
      },
      {
        name: 'Dr. Kamal Hossain',
        specialty: 'Neurologist',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
        experience: '12 years',
        availability: ['10:00 AM - 01:00 PM', '05:00 PM - 08:00 PM'],
        description: 'Expert neurologist with specialization in brain disorders, stroke management, and neuro-rehabilitation.',
        hospital: 'Square Hospital',
        location: 'Panthapath, Dhaka',
        fee: 1000,
        rating: 4.8
      },
      {
        name: 'Dr. Fatima Begum',
        specialty: 'Dermatologist',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
        experience: '8 years',
        availability: ['09:00 AM - 11:00 AM', '03:00 PM - 06:00 PM'],
        description: 'Board-certified dermatologist specializing in skin conditions, cosmetic procedures, and laser treatments.',
        hospital: 'United Hospital',
        location: 'Gulshan, Dhaka',
        fee: 600,
        rating: 4.7
      },
      {
        name: 'Dr. Rahim Uddin',
        specialty: 'Orthopedic Surgeon',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
        experience: '15 years',
        availability: ['08:00 AM - 12:00 PM', '04:00 PM - 07:00 PM'],
        description: 'Renowned orthopedic surgeon specializing in joint replacement, sports injuries, and spine surgery.',
        hospital: 'Apollo Hospital',
        location: 'Bashundhara, Dhaka',
        fee: 1200,
        rating: 4.9
      },
      {
        name: 'Dr. Nusrat Jahan',
        specialty: 'Pediatrician',
        image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop',
        experience: '7 years',
        availability: ['10:00 AM - 02:00 PM', '04:00 PM - 06:00 PM'],
        description: 'Compassionate pediatrician dedicated to child health, vaccinations, and developmental care.',
        hospital: 'Bangladesh Medical College',
        location: 'Dhanmondi, Dhaka',
        fee: 500,
        rating: 4.8
      },
      {
        name: 'Dr. Shahidul Islam',
        specialty: 'ENT Specialist',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
        experience: '11 years',
        availability: ['09:00 AM - 12:00 PM', '03:00 PM - 07:00 PM'],
        description: 'Experienced ENT specialist treating ear, nose, and throat conditions with modern diagnostic techniques.',
        hospital: 'Ibn Sina Hospital',
        location: 'Mohakhali, Dhaka',
        fee: 700,
        rating: 4.6
      }
    ];

    await Doctor.deleteMany({});
    const doctors = await Doctor.insertMany(demoDoctors);
    res.json({ success: true, message: 'Doctors seeded successfully', count: doctors.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
