const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const noteRoutes = require('./routes/noteRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Information',
      contact: {
        name: 'Developer',
        email: 'developer@example.com'
      },
      servers: [{ url: 'http://localhost:3000' }]
    }
  },
  apis: ['./routes/*.js'] // Ensure this path is correct
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use route files
app.use('/auth', authRoutes);
app.use('/profiles', profileRoutes);
app.use('/notes', noteRoutes);
app.use('/bookings', bookingRoutes);

// Initialize database tables
async function initializeDatabase() {
  try {
    // Initialize notes table
    const notesExists = await db.schema.hasTable('notes');
    if (!notesExists) {
      await db.schema.createTable('notes', table => {
        table.increments('note_id').primary();
        table.string('diary_name').notNullable();
        table.string('candidate').notNullable();
        table.string('channel').notNullable();
        table.string('zodiac_sign').notNullable();
        table.string('date_purpose').notNullable();
        table.date('date').notNullable();
        table.string('place').notNullable();
        table.integer('times_of_date').notNullable();
        table.text('reflection').notNullable();
        table.decimal('cost', 10, 2).notNullable();
        table.string('next_date').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log('Notes table created');
    }

    // Initialize bookings table
    const bookingsExists = await db.schema.hasTable('bookings');
    if (!bookingsExists) {
      await db.schema.createTable('bookings', table => {
        table.increments('booking_id').primary();
        table.integer('user_id').notNullable();
        table.enu('appointment_type', ['Eyelash', 'Manicure', 'Laser', 'Injection', 'Laser Hair Removal', 'Hair', 'SPA', 'Massage', 'GP', 'Therapist']).notNullable();
        table.datetime('appointment_date').notNullable();
        table.string('salon_name').notNullable();
        table.decimal('cost', 10, 2).notNullable();
        table.integer('times').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.foreign('user_id').references('users.user_id');
      });
      console.log('Bookings table created');
    }
  } catch (err) {
    console.error('Database initialization failed:', err);
  }
}

initializeDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
