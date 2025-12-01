import mysql from 'mysql2/promise';
import dotenv from 'dotenv'

dotenv.config();

export async function connectdatabase() {
    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            port: 4000,
            user: "root",       
            password: "password", 
            database: "mysqlnotes", 
        })
        console.log(`Database connected`)
        return connection
    }
    catch (err) {
        console.log("Error");
        throw err
    }
}