import {
    createContext,
    useContext,
    useState,
    useRef
} from "react";



const ToastContext = createContext();



export function ToastProvider({ children }){


    const [toast,setToast] = useState(null);


    const timerRef = useRef(null);




    const showToast = (
        message,
        type = "success"
    ) => {



        setToast({

            message,

            type

        });



        if(timerRef.current){

            clearTimeout(timerRef.current);

        }



        timerRef.current = setTimeout(()=>{


            setToast(null);


        },3000);



    };





    return(


        <ToastContext.Provider

        value={{

            showToast

        }}

        >


            {children}




            {

            toast &&


            <div

            className={`toast ${toast.type}`}

            >

                {toast.message}


            </div>


            }



        </ToastContext.Provider>


    );


}






export function useToast(){


    return useContext(ToastContext);


}