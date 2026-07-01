function KPICard({

title,

value,

icon

}){


return(


<div className="kpi-card">


{icon}


<p>

{title}

</p>


<h1>

{value}

</h1>



</div>


);


}


export default KPICard;