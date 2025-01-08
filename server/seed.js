import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Data model schema
const dataSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
      type: String, // Changed to String to accept "gchow" directly
      required: true,
    },
    data: {
      type: String,
      required: [true, 'Please provided copied data'],
    },
  },
  { timestamps: true }
);

const Data = mongoose.model('Data', dataSchema);

// Sample data to insert
const sampleData = [
  {
    data: 'FTRI 51',
  },
  {
    data: 'IS',
  },
  {
    data: 'THE',
  },
  {
    data: 'BEST!!',
  },
  {
    data: 'buy groceries',
  },
];

// Connect to MongoDB
async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Using "gchow" as the exact userId
    const userId = 'gchow';
    console.log('Using userId:', userId);

    // Create data documents
    const dataToInsert = sampleData.map((item) => ({
      _id: new mongoose.Types.ObjectId(),
      userId: userId,
      data: item.data,
    }));

    // Insert the data
    const result = await Data.insertMany(dataToInsert);
    console.log('Successfully inserted', result.length, 'documents');
    console.log('Inserted documents:', result);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedData();
