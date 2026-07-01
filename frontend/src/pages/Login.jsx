import { useState } from "react";

import API from "../api/axios";

import {
    useNavigate
} from "react-router-dom";


import {
    useAuth
} from "../context/AuthContext";


import {
    useToast
} from "../context/ToastContext";


import {
    motion
} from "framer-motion";


import {
    CheckSquare,
    ShieldCheck,
    Zap
} from "lucide-react";


import "../styles/auth.css";



function Login(){


const navigate = useNavigate();


const {login}=useAuth();


const {showToast}=useToast();



const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [loading,setLoading]=useState(false);





const handleLogin=async(e)=>{


e.preventDefault();


setLoading(true);



try{


const response = await API.post(

"/auth/login",

{

email,

password

}

);



login(response.data);



showToast(

"Successfully logged in 🚀 Redirecting to dashboard...",

"success"

);



setTimeout(()=>{


navigate("/dashboard");


},1500);



}



catch(error){



showToast(

"Invalid email or password",

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

initial={{opacity:0,y:40}}

animate={{opacity:1,y:0}}

transition={{duration:0.5}}

>



<div className="brand-section">


<CheckSquare size={45}/>


<h1>

TaskFlow

</h1>


<p>

Smart productivity management platform

</p>


</div>





<h2>

Welcome Back 👋

</h2>



<p className="subtitle">

Manage your tasks smarter with TaskFlow

</p>







<form onSubmit={handleLogin}>


<input


type="email"


placeholder="Enter your email"


value={email}


onChange={(e)=>setEmail(e.target.value)}


/>






<input


type="password"


placeholder="Enter your password"


value={password}


onChange={(e)=>setPassword(e.target.value)}


/>








<button

className="auth-button"

disabled={loading}

>



{

loading

?

"Logging in..."

:

"Login"

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

Fast

</div>



</div>








<div className="auth-link">


Don't have an account?



<button


onClick={()=>navigate("/register")}


>


Create Account


</button>




</div>







</motion.div>





</div>



);


}



export default Login;