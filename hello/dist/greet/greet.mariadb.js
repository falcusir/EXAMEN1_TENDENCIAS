// En este archivo se realiza la conexion a la BDD, lee datos de conexion de .env
// Primero instalar el conector para MariaDB
//Crea un "puente" (conexión) con mariadb
import { createConnection } from 'mariadb';
import * as dotenv from 'dotenv';
dotenv.config();
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME
};
let connection;
async function connectToDatabase() {
    connection = await createConnection(dbConfig);
}
connectToDatabase();
//Operaciones con la BDD
export class Greet {
    //Busca todos los saludos en la tabla regards y los devuelve.
    static async findAll() {
        return await connection.query('SELECT id, greet, language FROM regards');
    }
    //Busca un saludo específico usando su ID.
    static async findById(id) {
        const result = await connection.query('SELECT id, greet, language FROM regards where id = ?', [id]);
        return result[0];
    }
    //Crea un nuevo saludo (recibe el texto y el idioma, lo guarda en la base de datos y devuelve el registro creado).
    static async create(param) {
        const [{ id }] = await connection.query('INSERT INTO regards (greet, language) VALUES (?, ?) returning id', [param.greet, param.language]);
        const result = await connection.query('SELECT id, greet, language FROM regards where id = ?', [id]);
        return result[0];
    }
    //EXAMEN PARCIAL 1
    //Actualizar un registro
    static async update(id, param) {
        await connection.query('UPDATE regards SET greet = ?, language = ? WHERE id = ?', [param.greet, param.language, id]);
        return await this.findById(id);
    }
    //Eliminar un registro por ID
    static async delete(id) {
        const result = await connection.query('DELETE FROM regards WHERE id = ?', [id]);
        return { deleted: result.affectedRows > 0 };
    }
    //
    static async stats() {
        // Total de registros
        const totalQuery = await connection.query('SELECT COUNT(*) AS total FROM regards');
        // Agrupación por idioma
        const groupQuery = await connection.query('SELECT language, COUNT(*) AS count FROM regards GROUP BY language');
        // Dar formato al resultado
        const countByLanguage = {};
        groupQuery.forEach((row) => {
            countByLanguage[row.language] = row.count;
        });
        return {
            total: totalQuery[0].total,
            countByLanguage
        };
    }
}
