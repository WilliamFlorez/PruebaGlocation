const express = require('express') // se instala express
const cors = require('cors')//se instala cors
const { Sequelize, DataTypes } = require('sequelize');

require('dotenv').config();
const app = express()

app.use(express.json()) //Para envio de informacion por body y en lenguaje JSON
app.use(cors())

//CONEXION A POSTGRES(RENDER Y LOCAL) CON .ENV
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
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
// Verificación de conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida');
    
    // Sincroniza modelos (crea tablas si no existen)
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados');
  } catch (error) {
    console.error('Error de conexión:', error);
  }
})();



//###################### END POINTS ##############################

//Crear tarea (campos: título,
//                     descripción,
//                     estado = pendiente, en_progreso, completada)
app.post( "/tasks" , async (request,response) =>{
   try {
    const task = await Task.create({
      title: request.body.title,
      description: request.body.description || null,
      status: request.body.status  || 'pendiente',
      priority: request.body.priority  || 3,
      due_date: request.body.due_date
    });
    response.status(201).json(task);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
} )

// Listar todas las tareas (paginación y filtro por estado)
app.get('/tasks', async (request, response) => {
  try {
    const tasks = await Task.findAll();
    response.json(tasks);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
})

app.get('/tasks/:id', (request,response)=>{
    try{
        const id = Number(request.params.id)
        const task = id;
        if(!task){
            return response.status(404).json({error:'tarea no existe'})
        }
        response.json(task);
    }catch (error){
            response.status(500).json({ error: error.message });
    }
})

app.delete('/tasks/:id',async (request,response)=>{
    try {
    const id = request.params.id;
    const deleted = await Task.destroy({
      where: { id: id }
    });
    
    if (!deleted) {
      return response.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    response.status(204).end();
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
})

// Endpoint para actualizar tarea
app.put('/tasks/:id', async (req, res) => {
  try {
    const [updated] = await Task.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    const updatedTask = await Task.findByPk(req.params.id);
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT=3001
app.listen(PORT,()=>{
    console.log(`Servidor local en linea`)
})
