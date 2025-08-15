import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

//const API_URL = 'http://localhost:3001/tasks'; // Cambié a /tasks para coincidir con tu backend
//URL para conectar a render y a local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/tasks';

function App() {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pendiente',
    priority: 3
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener todas las tareas
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva tarea
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, newTask);
      setNewTask({
        title: '',
        description: '',
        status: 'pendiente',
        priority: 3
      });
      fetchTasks(); // Actualizar la lista
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (id) => {
    if(true){
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchTasks(); // Actualizar la lista
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar la tarea');
      }
    }
  };

  // Actualizar estado de tarea
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  // Cargar tareas al inicio
  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <div className="loading">Cargando tareas...</div>;

  return (
    <div className="app-container">
      <h1>Gestor de Tareas</h1>
      
      {/* Formulario para crear tareas */}
      <form onSubmit={handleCreateTask} className="task-form">
        <h2>Nueva Tarea</h2>
        <div className="form-group">
          <label>Título*</label>
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label>Prioridad</label>
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({...newTask, priority: parseInt(e.target.value)})}
          >
            <option value="1">Alta</option>
            <option value="2">Media</option>
            <option value="3">Baja</option>
          </select>
        </div>
        
        <button type="submit" className="submit-btn">Crear Tarea</button>
      </form>

      {/* Listado de tareas */}
      <div className="tasks-container">
        <h2>Lista de Tareas</h2>
        {tasks.length === 0 ? (
          <p>No hay tareas registradas</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`priority priority-${task.priority}`}>
                    Prioridad: {['Alta', 'Media', 'Baja'][task.priority - 1]}
                  </span>
                </div>
                
                {task.description && <p className="task-description">{task.description}</p>}
                
                <div className="task-footer">
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateStatus(task.id, e.target.value)}>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="completada">Completada</option>
                  </select>
                  
                  <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="delete-btn"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;