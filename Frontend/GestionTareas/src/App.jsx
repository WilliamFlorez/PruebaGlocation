import { useState } from 'react'
import './App.css'
import axios from "axios"
import { useEffect } from 'react'

const baseUrl = 'http://localhost:3001/task'; 
//const url =''


const TextBar = ({mensajeInput,HandleChange,Publicar }) => {
        return(
          <div>
              <div>
                <form onSubmit={Publicar}>
                    <input value={mensajeInput} onChange={HandleChange}></input>
                    <button type='submit'>Publicar</button>
                </form>
              </div>
          </div>
        )

}


function App() {
  const [texto, setTexto] = useState('')
  const [task, setTask] = useState([])

          const HandleChange =(event)=>{
            console.log("TEXT-BAR:: "+event.target.value)
            setTexto(event.target.value)
          }

          useEffect(()=>{
              axios.get(baseUrl).then(
                response => {
                  setTask(response.data)
                }
              )
          })

    const Delete =(props)=>{}
    const Edit = (props)=>{}

    const Listar = () => {
      return (
          <div>
            {task.map( (mensaje,index)=> {
                return(
                  <div>
                    <div>
                      <div key={index}> {index+1} || {ActualTask.text}</div>
                        <button  key={index} onClick={Delete}  value={ActualTask.id}>Eliminar</button>
                        <button  key={index} onClick={Edit} >Editar</button>
                    </div>
                  </div>
                )
            })}
          </div>
      );
    };

  return (
    <>
      <div>
                    <title>PRUEBA TECNICA</title>

          <Listar/>
      </div>
      <div>
          <TextBar  mensajeInput={texto}
                    HandleChange={HandleChange}
                    Publicar={Publicar} />
      </div>
    </>
  )
}

export default App
