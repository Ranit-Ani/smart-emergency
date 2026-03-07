require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', limiter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-emergency')
  .then(() => {
    console.log('✅ MongoDB Connected');
    seedAdminAndHospitals();
  })
  .catch(err => console.error('❌ MongoDB Error:', err));

// Routes
const hospitalRoutes = require('./routes/hospitals');
const adminRoutes = require('./routes/admin');

app.use('/api/hospitals', hospitalRoutes);
app.use('/api/admin', adminRoutes);

// Serve admin login page
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

// Fallback to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Seed default admin and sample hospitals
async function seedAdminAndHospitals() {
  const Admin = require('./models/Admin');
  const Hospital = require('./models/Hospital');
  const bcrypt = require('bcryptjs');

  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
      await Admin.create({
        email: process.env.ADMIN_EMAIL || 'admin@smartemergency.com',
        password: hashed
      });
      console.log('✅ Default admin created');
    }

    const hospitalCount = await Hospital.countDocuments();
    if (hospitalCount === 0) {
      const sampleHospitals = [
        {
          name: "Apollo Gleneagles Hospital",
          address: "58, Canal Circular Road, Kadapara, Phool Bagan",
          city: "Kolkata",
          latitude: 22.5726,
          longitude: 88.3939,
          phone: "+913323201000",
          departments: ["Cardiology", "Neurology", "Trauma Center", "Emergency Medicine", "General Medicine"],
          emergency_services: true,
          emergency_available: true,
          rating: 4.5
        },
        {
          name: "SSKM Hospital",
          address: "244, AJC Bose Road",
          city: "Kolkata",
          latitude: 22.5355,
          longitude: 88.3443,
          phone: "+912222041368",
          departments: ["Cardiology", "Neurology", "Trauma Center", "Gynecology", "General Medicine", "Emergency Medicine"],
          emergency_services: true,
          emergency_available: true,
          rating: 4.2
        },
        {
          name: "Fortis Hospital",
          address: "730, Anandapur, EM Bypass",
          city: "Kolkata",
          latitude: 22.5178,
          longitude: 88.3986,
          phone: "+913366284444",
          departments: ["Cardiology", "Neurology", "Trauma Center", "Gynecology", "General Medicine"],
          emergency_services: true,
          emergency_available: false,
          rating: 4.3
        },
        {
          name: "Medica Superspecialty Hospital",
          address: "127, Mukundapur, E.M. Bypass",
          city: "Kolkata",
          latitude: 22.5027,
          longitude: 88.3940,
          phone: "+913340400400",
          departments: ["Cardiology", "Neurology", "Emergency Medicine", "General Medicine"],
          emergency_services: true,
          emergency_available: true,
          rating: 4.1
        },
        {
          name: "Bellevue Clinic",
          address: "9, U N Brahmachari Street",
          city: "Kolkata",
          latitude: 22.5564,
          longitude: 88.3600,
          phone: "+913322872321",
          departments: ["General Medicine", "Gynecology", "Emergency Medicine"],
          emergency_services: true,
          emergency_available: true,
          rating: 3.9
        },
        {
          name: "RG Kar Medical College",
          address: "1, Khudiram Bose Sarani",
          city: "Kolkata",
          latitude: 22.5961,
          longitude: 88.3715,
          phone: "+912225565600",
          departments: ["Cardiology", "Trauma Center", "Emergency Medicine", "General Medicine", "Neurology"],
          emergency_services: true,
          emergency_available: true,
          rating: 4.0
        },
        {
          name: "Woodlands Multispeciality Hospital",
          address: "8/5, Alipore Road",
          city: "Kolkata",
          latitude: 22.5349,
          longitude: 88.3316,
          phone: "+913340901000",
          departments: ["Cardiology", "Neurology", "Gynecology", "General Medicine"],
          emergency_services: true,
          emergency_available: false,
          rating: 4.4
        },
        {
          name: "Peerless Hospital",
          address: "360, Pancha Sayar Road, Kolkata",
          city: "Kolkata",
          latitude: 22.4797,
          longitude: 88.3940,
          phone: "+913324612235",
          departments: ["Cardiology", "Emergency Medicine", "Trauma Center", "General Medicine"],
          emergency_services: true,
          emergency_available: true,
          rating: 4.2
        }
      ];
      await Hospital.insertMany(sampleHospitals);
      console.log('✅ Sample hospitals seeded');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
}

app.listen(PORT, () => {
  console.log(`🚑 Smart Emergency running on port ${PORT}`);
});
