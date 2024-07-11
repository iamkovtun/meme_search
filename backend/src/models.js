const { Sequelize, DataTypes, Op } = require('sequelize');

// Initialize Sequelize with your database connection
const sequelize = new Sequelize('postgres', 'postgres', '1111', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log // This will log SQL queries to the console
});


// Define the Meme model
const Meme = sequelize.define('Meme', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },  
  extracted_text: {
    type: DataTypes.TEXT,
    allowNull: false 
  }},
  {
    tableName: 'Memes',
    timestamps: false // Disable timestamps
  });


// Function to initialize the database
async function initializeDatabase() {
  try {
    // Create the schema if it doesn't exist
    await sequelize.query('CREATE SCHEMA IF NOT EXISTS meme;');

    // Sync the models with the database
    await Meme.sync({ force: true });

    console.log('Database & tables created!');
  } catch (error) {
    console.error('Unable to create tables:', error);
  }
}

module.exports = {
  sequelize,
  Op,
  Meme,
  initializeDatabase
};