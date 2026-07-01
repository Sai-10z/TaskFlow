import {
    useNavigate
} from "react-router-dom";


import {
    LayoutDashboard,
    ListTodo,
    LogOut,
    CheckSquare
} from "lucide-react";


import {
    useAuth
} from "../context/AuthContext";


import {
    useToast
} from "../context/ToastContext";



function Sidebar(){


const navigate = useNavigate();


const {logout}=useAuth();


const {showToast}=useToast();





const handleLogout=()=>{


logout();



showToast(

"Successfully logged out 👋",

"success"

);



setTimeout(()=>{


navigate("/login");


},1000);



};





return(



<aside className="sidebar">





<div className="sidebar-brand">


<CheckSquare size={30}/>


<h2>

TaskFlow

</h2>


</div>






<div className="sidebar-menu">





<button

onClick={()=>navigate("/dashboard")}

>


<LayoutDashboard size={20}/>


Dashboard


</button>








<button

onClick={()=>navigate("/tasks")}

>


<ListTodo size={20}/>


Tasks


</button>








</div>







<button

className="sidebar-logout"

onClick={handleLogout}

>


<LogOut size={20}/>


Logout


</button>







</aside>



);


}



export default Sidebar;