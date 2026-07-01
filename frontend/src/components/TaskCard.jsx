import { useState } from "react";


import PriorityBadge from "./PriorityBadge";


import {
    motion
} from "framer-motion";


import {
    CheckCircle,
    Edit3,
    Trash2,
    Calendar
} from "lucide-react";



function TaskCard({


task,

editTask,

deleteTask,

completeTask


}){



const [showDetails,setShowDetails] = useState(false);





return(



<motion.div


className="task-card"


whileHover={{

scale:1.03

}}



onMouseEnter={()=>


setShowDetails(true)


}



onMouseLeave={()=>


setShowDetails(false)


}



>







<div className="task-main">





<h2>

{task.title}

</h2>







<PriorityBadge

priority={task.priority}

/>







<p>


{

task.completed


?


"✅ Completed"


:


"⏳ Pending"


}



</p>





</div>








{

showDetails &&





<motion.div


className="task-popup"



initial={{

opacity:0,

y:20

}}


animate={{

opacity:1,

y:0

}}



transition={{

duration:0.25

}}



>





<h3>

Task Details

</h3>








<p>


<strong>

Title:

</strong>


{task.title}


</p>









<p>


<strong>

Description:

</strong>


{task.description || "No description"}


</p>









<p>


<strong>


<Calendar size={15}/>


Created:


</strong>


{

new Date(

task.created_at

)

.toLocaleDateString()


}



</p>










<div className="task-actions">






<button


onClick={()=>completeTask(task.id)}


disabled={task.completed}


>


<CheckCircle size={16}/>


Complete


</button>










<button


onClick={()=>editTask(task)}


>


<Edit3 size={16}/>


Edit


</button>









<button


className="delete-action"


onClick={()=>deleteTask(task.id)}


>


<Trash2 size={16}/>


Delete


</button>







</div>









</motion.div>





}








</motion.div>



);


}



export default TaskCard;