import { Sequelize } from 'sequelize-typescript';
import { config } from 'dotenv';
import User from './models/user-modal';

config(); 

const connectionString = process.env.CONNECTION_STRING;

if (!connectionString) {
  throw new Error('Missing CONNECTION_STRING in .env');
}

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  models: [User], // loads all models from the models folder
  logging: false, // enable if you want SQL logs
});

// Authenticate and sync the database
try {
    sequelize.authenticate()
  .then(() => {
    console.log("Authentication Successful!");
  })
  .catch((err) => {
    console.error(`Unexpected Error occurred: ${err}`);
  });
} catch (error) {
    console.log(error)
}

sequelize.sync({force:false,alter:false}).then(()=>{
    console.log("Migration Successful!")
})

export default sequelize;
