import {
    Flame,
    Minus,
    Leaf
} from "lucide-react";



function PriorityBadge({priority}){


const level = priority?.toLowerCase() || "low";



const config = {


high:{

label:"HIGH",

icon:<Flame size={14}/>

},


medium:{

label:"MEDIUM",

icon:<Minus size={14}/>

},


low:{

label:"LOW",

icon:<Leaf size={14}/>

}


};




return(


<span className={`priority-badge ${level}`}>



{config[level].icon}



{config[level].label}



</span>


);


}



export default PriorityBadge;