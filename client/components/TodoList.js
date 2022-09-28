import Navbar from './Navbar'
import { IoMdAddCircle } from 'react-icons/io'
import Task from './Task'

const TodoList = ({ tasks, input, setInput, addTask, deleteTask }) => <div className='w-[70%] bg-[#ba55d3] py-4 px-9 rounded-[30px] overflow-y-scroll'>
  <Navbar />
  <h2 className='text-4xl bolder text-white pb-8'>
    What&apos;s up, Ayesha!
  </h2>
  <div className='py-3 text-[#FFFFFF]'>TODAY&apos;S TASKS</div>
  <form className='flex items-center justify-center'>
    <input
      className='rounded-[10px] w-full p-[10px] border-none outline-none bg-[#663399] text-white mb-[10px]'
      placeholder='Add a task for today...'
      value={input}
      onChange={e => setInput(e.target.value)}
    />
    <IoMdAddCircle
      onClick={addTask}
      className='text-[#FFFFFF] text-[50px] cursor-pointer ml-[20px] mb-[10px]'
    />
  </form>
  <ul>
    {tasks.map(item => (
    <Task 
      key = {item.id}
      taskText = {item.taskText}
      onClick={deleteTask(item.id)}
      />
    ))}
  </ul>
</div>

export default TodoList