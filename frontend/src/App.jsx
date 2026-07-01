import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import Sidebar from "./components/Sidebar";


import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";


import ProtectedRoute from "./components/ProtectedRoute";




function App(){



return(



<BrowserRouter>



<Routes>





{/* =====================
    PUBLIC PAGES
===================== */}





<Route

path="/login"

element={<Login/>}

/>






<Route

path="/register"

element={<Register/>}

/>









{/* =====================
    PROTECTED PAGES
===================== */}





<Route


path="/dashboard"


element={



<ProtectedRoute>



<div className="app-layout">



<Sidebar/>




<main className="main-content">


<Dashboard/>


</main>



</div>



</ProtectedRoute>



}



/>










<Route


path="/tasks"


element={



<ProtectedRoute>



<div className="app-layout">



<Sidebar/>




<main className="main-content">


<Tasks/>


</main>



</div>



</ProtectedRoute>



}



/>









{/* =====================
    FALLBACK
===================== */}




<Route


path="*"


element={<Navigate to="/login"/>}



/>







</Routes>





</BrowserRouter>



);


}



export default App;