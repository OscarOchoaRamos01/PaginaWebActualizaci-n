
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 3000;

// Configuración de middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname)));

// Configuración de conexión a MySQL
let conexion = mysql.createConnection({
    host: "localhost",
    database: "dbConsultas",
    user: "root",
    password: "williams3101",
    port: 33061
});

conexion.connect(function(err) {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos.');
});

// Manejo de la solicitud POST del formulario
app.post('/submit-form', (req, res) => {
    const { nombres, apellidos, celular, gmail, consulta } = req.body;

    const query = 'INSERT INTO Consultas (nombres, apellidos, celular, gmail, consulta) VALUES (?, ?, ?, ?, ?)';
    conexion.query(query, [nombres, apellidos, celular, gmail, consulta], (err, result) => {
        if (err) {
            console.error('Error al insertar datos: ' + err.stack);
            res.status(500).send('Ocurrió un error al procesar tu consulta.');
            return;
        }

        // Envía una respuesta con el HTML completo de la página a la que deseas redirigir, con el mensaje de "Formulario enviado"
        res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Redireccionando...</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f3f3f3;
                    }

                    .loader-container {
                        text-align: center;
                    }

                    .loader {
                        border: 4px solid #f3f3f3; /* Light grey */
                        border-top: 4px solid #3498db; /* Blue */
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        animation: spin 2s linear infinite;
                        margin-bottom: 20px;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    .message {
                        font-size: 20px;
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <div class="loader-container">
                    <div class="loader"></div>
                    <p class="message">Formulario enviado. Redireccionando...</p>
                </div>
                <meta http-equiv="refresh" content="5;url=http://44.197.2.144:4000/index.html">
            </body>
            </html>
        `);
    });
});





// Servir el archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contactanos.html'));
});



//calendario..
app.get("/", function(req, res) {
  console.log("Ruta inicial");
  res.send("Ruta inicial");
});

app.get("/api/dates/:current", (req, res) => {
  var request = req.params.current;
  console.log(`Received request for date: ${request}`);
  
  const query = "SELECT NAMECAL, DESCCAL, DATE_FORMAT(DATECAL, '%d/%m/%Y') AS DATECAL FROM calendario WHERE DATECAL = ?";
  
  conexion.query(query, [request], function(err, rows, fields) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json(null);
    }
  });
});



app.listen(port, () => {
    console.log(`Servidor escuchando en http://127.0.0.1:${port}`);
});


