import { useState, useEffect } from 'react'
import './main.css'
import AddTaskPopup from './components/AddTaskPopup'

interface Task {
  id? : string;
  task: string;
  description: string;
  priority: string;
}

interface myProps {
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
}

function TaskManager(props: myProps) {
  const [tableData, setTableData] = useState<Task[]>([]);
  const [taskPopup, setTaskPopup] = useState(false);

  //Page Load inital sync from Supabase
  useEffect(() => {
    fetchFromSupabase();
  }, [])

  //Refresh when tasks change
  useEffect(() => {
    //console.log('tableData changed:', tableData);
  }, [tableData]);  

  const fetchFromSupabase = () => {
    fetch('http://localhost:5000/task/get', {
      method: "GET",
      credentials: "include"
    }).then((res) => res.json())
      .then((data) => {
        setTableData([...data]);
      })
      .catch((err) => {
        console.error('Failed to fetch from table:', err);
      });
  }

  const handleSubmit = async (taskData: Task) => {
    console.log(taskData)
    fetch('http://localhost:5000/task/post', {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData)
    }).then(() => { 
        fetchFromSupabase();    
      })
    .catch((err) => {
      console.error('Failed to fetch from table:', err);
    });
  }

  const handleDelete = async (id : number) => {
    console.log(id)
    fetch('http://localhost:5000/task/delete', {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({id}),
    }).then(() => fetchFromSupabase())      //Sync with Supabase
    .catch((err) => {
      console.error('Failed to delete from table:', err);
    });   
  }

  const handleLogOut = async() => {
    fetch('http://localhost:5000/auth/logout', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    }).then((res)=> {
      if(res.ok){
        props.setIsAuth(false)
      }})
  }

  return (
    <div className="grid gap-4 p-4 grid-rows-[auto,1fr]">
      <main>
        <div className="flex justify-between items-center shadow p-6 rounded">
          <h1 className="font-bold text-2xl">Task Manager</h1>
          <button
            className="ml-5 !bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2"
            onClick={() => setTaskPopup(true)}
          >
            <span className="text-xl leading-none"> + </span>
            Add Task
          </button>
          <button className="ml-5 !bg-red-500 text-white font-bold py-2 px-4 rounded-full gap-2" 
          onClick={handleLogOut}>
            Logout
          </button>
        </div>

        <div className="shadow px-4 sm:px-8 py-4 rounded">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">ID</th>
                <th className="px-4 py-2 border-b text-left">Task</th>
                <th className="px-4 py-2 border-b text-left">Description</th>
                <th className="px-4 py-2 border-b text-left">Priority</th>
              </tr>
            </thead>
            <tbody>
              {
              tableData.map((data) => (
                <tr key={data.id}>
                  <td className="px-4 py-2">{data.id}</td>
                  <td className="px-4 py-2">{data.task}</td>
                  <td className="px-4 py-2">{data.description}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-between items-center">
                      <span>{data.priority}</span>
                      <button
                        className="text-red-500 hover:text-red-700 ml-4 font-bold" 
                        onClick={() => handleDelete(parseInt(data.id!))}>
                        × </button>
                    </div>
                  </td>
                </tr>))} 
            </tbody>
          </table>
        </div>
      </main>

      <AddTaskPopup trigger={taskPopup} setTrigger={setTaskPopup} onSubmit={handleSubmit} />
    </div>
  );
}

export default TaskManager;
