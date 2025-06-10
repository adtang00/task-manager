import { useEffect, useState } from 'react'
import './components.css'
//import e from 'express';

interface Task {
  id? : string;
  task: string;
  description: string;
  priority: string;
}

type myProps = {
    trigger: boolean;
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (task: Task) => void;
    existingTask?: Task | null;
};

function AddTaskPopup(props: myProps){
    //if (!props.trigger) return null;
    const [task, setTask] = useState<Task>({
      task: '',
      description: '',
      priority: '',
    });

    useEffect(() => {
      if (props.existingTask) {
        setTask({
          task: props.existingTask.task,
          description: props.existingTask.description,
          priority: props.existingTask.priority,
        });
      } else {
        setTask({
          task: '',
          description: '',
          priority: '',
        });
      }
  }, [props.existingTask]);

    //Passes form info back to TaskManager
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      props.onSubmit(task);
      props.setTrigger(false);
    }

    const handleChange = (e:React.ChangeEvent) => {
      const { name, value } = e.target as HTMLInputElement;
      setTask(prev => ({
        ...prev,
        [name]: value
      }));
    };

    return (
        <div  className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center ${
    props.trigger ? '' : 'hidden'
  }`}>
          <div className="bg-white p-6 rounded shadow-lg w-96">
          <button
        onClick={() => props.setTrigger(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
      >
        &times;
      </button>
            <form className="grid gap-4">
              {/* Title */}
              <h2 className="text-xl font-semibold text-center">Add New Task</h2>
      
              {/* Task Name */}
              <div className="grid gap-1">
                <label htmlFor="taskName" className="text-sm font-medium text-gray-700">
                  Task Name
                </label>
                <input
                  id="taskName"
                  name="task"
                  value={task.task}
                  onChange={handleChange}
                  placeholder="Enter task name"
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
      
              {/* Description */}
              <div className="grid gap-1">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={task.description}
                  onChange={handleChange}
                  placeholder="Brief description"
                  className="border border-gray-300 p-2 rounded w-full"
                  rows={3}
                />
              </div>
      
              {/* Priority */}
              <div className="grid gap-1">
                <label htmlFor="priority" className="text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={task.priority}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                >
                  <option value="">Select priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
      
              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="!bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  onClick={(e)=>handleSubmit(e)}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      );
      
}

export default AddTaskPopup