import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const migrate = async () => {
  try {
    console.log('Starting migration...');

    // Users table already exists, but ensure role column
    // await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'`);

    // Pets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        breed VARCHAR(100),
        age VARCHAR(50),
        char VARCHAR(255),
        img TEXT,
        description TEXT,
        status VARCHAR(20) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Services table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        icon VARCHAR(50),
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        features TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Migration completed successfully.');
    
    // Seed initial data
    console.log('Seeding initial data...');
    
    const petsData = [
      ['Bella', 'dog', 'Golden Retriever', '2 Years', 'Friendly & Active', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400', 'A playful and loving Golden Retriever looking for an active family.'],
      ['Luna', 'cat', 'Siamese', '1 Year', 'Quiet & Cuddly', 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=400', 'Gentle Siamese who loves warm laps and quiet afternoons.'],
      ['Charlie', 'dog', 'Beagle', '3 Years', 'Curious & Energetic', 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400', 'Loyal companion who loves outdoor adventures and sniffing trails.'],
    ];

    for (const pet of petsData) {
      await pool.query(
        'INSERT INTO pets (name, type, breed, age, char, img, description) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING',
        pet
      );
    }

    const servicesData = [
      ['Signature Grooming', 'Scissors', 45, 'Full-service spa treatments, organic baths, and expert styling.', ['Hypoallergenic Shampoo', 'Hand-dried', 'Nail Buffing']],
      ['Luxury Boarding', 'Hotel', 60, 'Climate-controlled boutique suites with orthopaedic bedding.', ['Webcam Access', 'Daily Photos', 'Gourmet Treats']],
      ['Social Daycare', 'PlayCircle', 30, 'Our safe, supervised environment where your dog can socialize.', ['Agility Parks', 'Pool Time', 'Staff Supervision']],
    ];

    for (const service of servicesData) {
      await pool.query(
        'INSERT INTO services (title, icon, price, description, features) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        service
      );
    }

    const settingsData = [
      ['contact_email', 'contact@petpal.com'],
      ['platform_fee', '5.00'],
      ['site_name', 'PetPal Premier'],
    ];

    for (const setting of settingsData) {
      await pool.query(
        'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
        setting
      );
    }

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration/Seeding failed:', err);
    process.exit(1);
  }
};

migrate();
