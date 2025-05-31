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
  <div className="p-4 max-w-5xl mx-auto space-y-6">
    {/* Header */}
    <div className="flex justify-between items-center bg-white shadow-md p-6 rounded-lg">
      <h1 className="text-3xl font-extrabold text-gray-800">📝 Task Manager </h1>
      <div className="space-x-3">
        <button
          className="ml-5  !bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-full transition duration-200"
          onClick={() => setTaskPopup(true)}
        >
          + Add Task
        </button>
        <button
          className="!bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-full transition duration-200"
          onClick={handleLogOut}
        >
          Logout
        </button>
      </div>
    </div>

    {/* Task Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tableData.length > 0 ? (
        tableData.map((data) => (
          <div
            key={data.id}
            className="bg-white shadow rounded-lg p-4 border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{data.task}</h3>
              <p className="text-gray-600 text-sm mb-2">{data.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  data.priority === 'High'
                    ? 'bg-red-100 text-red-600'
                    : data.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-600'
                }`}
              >
                {data.priority}
              </span>
              <button
                onClick={() => handleDelete(parseInt(data.id!))}
                className="text-red-500 hover:text-red-700 text-lg font-bold"
              >
                ×
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 col-span-full text-center">No tasks available.</p>
      )}
    </div>

    {/* Add Task Modal */}
    <AddTaskPopup trigger={taskPopup} setTrigger={setTaskPopup} onSubmit={handleSubmit} />
  </div>
);
}

export default TaskManager;
