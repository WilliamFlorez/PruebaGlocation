import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3001/tasks';

function App() {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pendiente',
    priority: 3
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 5
  });
  const [totalTasks, setTotalTasks] = useState(0);

  // Obtener todas las tareas con filtros
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        params: {
          status: filters.status,
          page: filters.page,
          limit: filters.limit
        }
      });
      setTasks(response.data);
      
      // En una API real, deberías recibir el total desde el backend
      const countResponse = await axios.get(API_URL);
      setTotalTasks(countResponse.data.length);
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
      fetchTasks();
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchTasks();
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

  // Editar tarea
  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority
    });
  };

  // Actualizar tarea editada
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${editingTask.id}`, newTask);
      setEditingTask(null);
      setNewTask({
        title: '',
        description: '',
        status: 'pendiente',
        priority: 3
      });
      fetchTasks();
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      status: 'pendiente',
      priority: 3
    });
  };

  // Cambiar página
  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  // Cargar tareas al inicio y cuando cambian los filtros
  useEffect(() => {
    fetchTasks();
  }, [filters.status, filters.page]);

  if (loading) return <div className="loading">Cargando tareas...</div>;

  return (
    <div className="app-container">
      <h1>Gestor de Tareas</h1>
      
      {/* Filtros */}
      <div className="filters">
        <h2>Filtrar Tareas</h2>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_progreso">En Progreso</option>
          <option value="completada">Completada</option>
        </select>
      </div>

      {/* Formulario para crear/editar tareas */}
      <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="task-form">
        <h2>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
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
        
        <div className="form-group">
          <label>Estado</label>
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({...newTask, status: e.target.value})}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editingTask ? 'Actualizar Tarea' : 'Crear Tarea'}
          </button>
          {editingTask && (
            <button type="button" className="cancel-btn" onClick={cancelEdit}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Listado de tareas */}
      <div className="tasks-container">
        <h2>Lista de Tareas</h2>
        {tasks.length === 0 ? (
          <p>No hay tareas registradas</p>
        ) : (
          <>
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id} className={`task-item status-${task.status}`}>
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <div className="task-meta">
                      <span className={`priority priority-${task.priority}`}>
                        Prioridad: {['Alta', 'Media', 'Baja'][task.priority - 1]}
                      </span>
                      <span className={`status-badge status-${task.status}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  {task.description && <p className="task-description">{task.description}</p>}
                  
                  {task.due_date && (
                    <p className="due-date">
                      Fecha límite: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                  
                  <div className="task-footer">
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_progreso">En Progreso</option>
                      <option value="completada">Completada</option>
                    </select>
                    
                    <div className="task-actions">
                      <button 
                        onClick={() => handleEditTask(task)}
                        className="edit-btn"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="delete-btn"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Paginación */}
            <div className="pagination">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
              >
                Anterior
              </button>
              
              <span>Página {filters.page} de {Math.ceil(totalTasks / filters.limit)}</span>
              
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= Math.ceil(totalTasks / filters.limit)}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;