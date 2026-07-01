import { useEffect, useState } from "react";

import API from "../api/axios";

import TaskCard from "../components/TaskCard";

import { useToast } from "../context/ToastContext";

import {
    Plus,
    Filter
} from "lucide-react";

import "../styles/tasks.css";



function Tasks(){



const {showToast}=useToast();



const [tasks,setTasks] = useState([]);


const [title,setTitle] = useState("");

const [description,setDescription] = useState("");

const [priority,setPriority] = useState("LOW");


const [editingId,setEditingId] = useState(null);


const [loading,setLoading] = useState(true);


const [filter,setFilter] = useState("ALL");







const fetchTasks = async()=>{


try{


const response = await API.get("/tasks");


setTasks(response.data);


setLoading(false);


}


catch(error){


console.log(error);


showToast(

"Failed to load tasks",

"error"

);


setLoading(false);


}


};









const saveTask = async(e)=>{


e.preventDefault();



try{


if(editingId){


await API.put(

`/tasks/${editingId}`,

{

title,

description,

priority

}

);



showToast(

"Task updated successfully ✏️",

"success"

);



setEditingId(null);



}

else{


await API.post(

"/tasks",

{

title,

description,

priority

}

);



showToast(

"Task created successfully 🚀",

"success"

);



}




setTitle("");

setDescription("");

setPriority("LOW");



fetchTasks();



}



catch(error){



console.log(error);



showToast(

"Unable to save task",

"error"

);



}


};









const editTask=(task)=>{


setTitle(task.title);


setDescription(task.description);


setPriority(task.priority);


setEditingId(task.id);



};









const deleteTask=async(id)=>{


try{


await API.delete(

`/tasks/${id}`

);



showToast(

"Task deleted successfully 🗑️",

"success"

);



fetchTasks();


}


catch(error){



showToast(

"Unable to delete task",

"error"

);



}


};









const completeTask=async(id)=>{


try{


await API.patch(

`/tasks/${id}/complete`

);



showToast(

"Task completed ✅",

"success"

);



fetchTasks();


}


catch(error){



showToast(

"Unable to complete task",

"error"

);


}


};









useEffect(()=>{


fetchTasks();


},[]);







const filteredTasks =


filter==="ALL"

?

tasks

:

tasks.filter(

task=>task.priority===filter

);









return(



<div className="tasks-container">





<div className="tasks-header">


<h1>

My Tasks 🚀

</h1>



<p>

Organize your workflow with priorities

</p>



</div>









<div className="task-controls">



<button

onClick={()=>setFilter("ALL")}

>

All

</button>



<button

onClick={()=>setFilter("HIGH")}

>

🔴 High

</button>



<button

onClick={()=>setFilter("MEDIUM")}

>

🟡 Medium

</button>



<button

onClick={()=>setFilter("LOW")}

>

🟢 Low

</button>



</div>









<form

className="task-form"

onSubmit={saveTask}

>




<h2>


{

editingId

?

"Edit Task"

:

"Create New Task"

}


</h2>






<input

placeholder="Task title"

value={title}

onChange={(e)=>

setTitle(e.target.value)

}

/>






<textarea

placeholder="Describe your task"

value={description}

onChange={(e)=>

setDescription(e.target.value)

}

/>







<select

value={priority}

onChange={(e)=>

setPriority(e.target.value)

}

>


<option value="HIGH">

HIGH

</option>



<option value="MEDIUM">

MEDIUM

</option>



<option value="LOW">

LOW

</option>



</select>






<button>


<Plus size={18}/>



{

editingId

?

"Update Task"

:

"Create Task"

}


</button>





</form>









<div className="task-grid">



{

loading

?


<h2>

Loading tasks...

</h2>



:

filteredTasks.length===0

?


<div>

<h2>

No tasks found 🚀

</h2>


<p>

Create your first TaskFlow task

</p>


</div>



:


filteredTasks.map(task=>(


<TaskCard


key={task.id}


task={task}


editTask={editTask}


deleteTask={deleteTask}


completeTask={completeTask}


/>



))


}



</div>







</div>



);


}



export default Tasks;