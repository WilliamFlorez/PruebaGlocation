const express = require('express') // se instala express
const cors = require('cors')//se instala cors
const { Sequelize } = require('sequelize')
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





//Crear tarea (campos: título,
//                     descripción,
//                     estado = pendiente, en_progreso, completada)
app.post( "/task" , (request,response) =>{
   task_title = request.body.titulo
   task_description = request.body.dexcripcion
   task_state = request.body.estado
   task_due_date   = request.body.due_date  
   task_created_at  = request.body.created_at 
   task_updated_at   = request.body.updated_at  
   
   if(task_text == null){
        "No se recivio texto"
   }else{
        const estructura ={
            title : task_title,
            descripcion : task_description,
            status : task_state
        }
   }
} )

// Listar todas las tareas (paginación y filtro por estado)
app.get('/task', (request,response)=>{ 

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
