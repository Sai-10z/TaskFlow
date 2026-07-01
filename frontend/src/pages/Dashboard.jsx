import { useEffect, useState } from "react";

import { 
    useNavigate 
} from "react-router-dom";


import API from "../api/axios";


import KPICard from "../components/KPICard";


import {
    ListTodo,
    CheckCircle,
    Clock
} from "lucide-react";


import "../styles/dashboard.css";



function Dashboard(){


const navigate = useNavigate();



const [stats,setStats] = useState({

    total:0,

    completed:0,

    pending:0

});



const user = JSON.parse(

localStorage.getItem("user")

);







const fetchStats = async()=>{


try{


const response = await API.get("/tasks");


const tasks = response.data;




setStats({


total:

tasks.length,



completed:

tasks.filter(

task => task.completed

).length,




pending:

tasks.filter(

task => !task.completed

).length



});



}

catch(error){


console.log(error);


}



};






useEffect(()=>{


fetchStats();


},[]);







return(



<div className="dashboard-container">





<div className="dashboard-header">


<h1>

Welcome back, {user?.username} 👋

</h1>



<p>

Track your productivity and stay organized with TaskFlow

</p>



</div>







<div className="kpi-container">



<KPICard

title="Total Tasks"

value={stats.total}

icon={<ListTodo size={32}/>}

/>




<KPICard

title="Completed"

value={stats.completed}

icon={<CheckCircle size={32}/>}

/>




<KPICard

title="Pending"

value={stats.pending}

icon={<Clock size={32}/>}

/>



</div>








<div className="quick-action">


<button


className="view-button"


onClick={()=>navigate("/tasks")}


>


View All Tasks 🚀


</button>


</div>






</div>



);


}



export default Dashboard;