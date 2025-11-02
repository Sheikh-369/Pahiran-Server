//1st
import { Sequelize } from "sequelize-typescript";
import { config } from "dotenv";
config();


const sequelize = new Sequelize(process.env.CONNECTION_STRING as string,{
    models : [__dirname + '/models']
});

export default sequelize;