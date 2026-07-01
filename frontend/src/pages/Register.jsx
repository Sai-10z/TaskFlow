import { useState } from "react";

import API from "../api/axios";

import {
    useNavigate
}
from "react-router-dom";


import {
    useToast
}
from "../context/ToastContext";


import {
    motion
}
from "framer-motion";


import {
    UserPlus,
    ShieldCheck,
    Zap,
    CheckSquare
}
from "lucide-react";


import "../styles/auth.css";



function Register(){


const navigate = useNavigate();


const {showToast}=useToast();



const [username,setUsername]=useState("");

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [loading,setLoading]=useState(false);







const handleRegister = async(e)=>{


e.preventDefault();


setLoading(true);



try{


await API.post(

"/auth/register",

{

username,

email,

password

}

);





showToast(

"Account created successfully 🚀 Redirecting to login...",

"success"

);





setTimeout(()=>{


navigate("/login");


},1500);





}



catch(error){



showToast(

error.response?.data?.message ||

"Registration failed",

"error"

);



}



finally{


setLoading(false);


}



};









return(



<div className="auth-container">



<motion.div


className="auth-card"


initial={{

opacity:0,

y:40

}}


animate={{

opacity:1,

y:0

}}


transition={{

duration:0.5

}}



>





<div className="brand-section">


<CheckSquare size={45}/>



<h1>

TaskFlow

</h1>



<p>

Build. Track. Complete.

</p>


</div>








<h2>

Create Account 🚀

</h2>




<p className="subtitle">

Start managing your workflow smarter

</p>









<form onSubmit={handleRegister}>






<input


type="text"


placeholder="Enter username"


value={username}


onChange={

(e)=>setUsername(e.target.value)

}


/>








<input


type="email"


placeholder="Enter email"


value={email}


onChange={

(e)=>setEmail(e.target.value)

}


/>









<input


type="password"


placeholder="Create password"


value={password}


onChange={

(e)=>setPassword(e.target.value)

}


/>









<button


className="auth-button"


disabled={loading}


>



{

loading

?

"Creating Account..."

:

"Create Account"

}



</button>







</form>









<div className="feature-row">


<div>

<ShieldCheck size={18}/>

Secure

</div>




<div>

<Zap size={18}/>

Fast Setup

</div>



<div>

<UserPlus size={18}/>

Easy Start

</div>



</div>










<div className="auth-link">



Already have an account?





<button


onClick={()=>navigate("/login")}


>


Login


</button>







</div>







</motion.div>







</div>



);



}




export default Register;