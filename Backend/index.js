const express = require('express') // se instala express
const cors = require('cors')//se instala cors
const { Sequelize, DataTypes } = require('sequelize');
const app = express()

app.use(express.json()) //Para envio de informacion por body y en lenguaje JSON
app.use(cors())

//CONEXION A POSTGRES(RENDER Y LOCAL) CON .ENV
const sequelize = new Sequelize(process.env.DATABASE_URL || {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialectOptions: process.env.DATABASE_URL ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {},
  logging: console.log // Para ver las consultas SQL en consola
});

// TABLA TASK
const Task = sequelize.define( 'Task',{
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pendiente',
    validate: {
      isIn: [['pendiente', 'en_progreso', 'completada']]
    }
  },
  priority: {
    type: DataTypes.SMALLINT,
    defaultValue: 3,
    validate: {
      min: 1,
      max: 3
    }
  },
  due_date: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Sincronizar modelo con la base de datos
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false }); // force:true borra y recrea las tablas
    console.log('Tabla "tasks" creada/verificada en PostgreSQL');
  } catch (error) {
    console.error('Error al conectar con PostgreSQL:', error);
  }
})();



//###################### END POINTS ##############################

//Crear tarea (campos: título,
//                     descripción,
//                     estado = pendiente, en_progreso, completada)
app.post( "/task" , async (request,response) =>{
   try {
    const task = await Task.create({
      title: request.body.titulo,
      description: request.body.descripcion,
      status: request.body.estado || 'pendiente',
      priority: request.body.priority || 3,
      due_date: request.body.due_date
    });
    response.status(201).json(task);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
} )

// Listar todas las tareas (paginación y filtro por estado)
app.get('/task', async (request, response) => {
  try {
    const tasks = await Task.findAll();
    response.json(tasks);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
})

app.get('/task/:id', (request,response)=>{
    const id = Number(request.params.id)
})

app.delete('/tasks/:id',(request,response)=>{
    const id = Number(request.params.id)
     
})

const PORT=3001
app.listen(PORT,()=>{
    console.log(`Servidor local en linea`)
})
