
"use client"

import TodoItem from "./TodoItem"
import { useEffect,useState } from "react"
import { useSelector,useDispatch } from "react-redux"
import { addData } from "../redux/dataStorage"


const TodoApp = () => {
    // Make request to end point
    const fetchDataPOST = async () => {
        try {
            const response = await fetch("http://localhost:4080/api/todo", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({ todo: usersTodo, isCompleted: false })
            })
            const data = await response.json();
            console.log(data)
            return data;
        } catch (err) {
            console.error(err)
        }
    }
    // const [ dataStorage,setDataStorage ] = useState<any[]>([])
    const dataStorage = useSelector(state => state?.dataStore.storage);
    const dispatch = useDispatch()

    const fetchDataGET = async () => {
        try {
            const response = await fetch("http://localhost:4080/api/todo", {
                method: "GET",
                headers: {"Content-Type" : "application/json"}
            })
            const data = await response.json();
            console.log(data)
            dispatch(addData(data.database));
            
        } catch (err) {
            console.error(err)
        } 
    }

    // handle typing and onChange event
    const [ usersTodo, setUsersTodo ] = useState<string>("");
    const handleUsersTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsersTodo(prev => e.target.value);
    }

    // add new todo 

    useEffect(() => {
        fetchDataGET()
    }, [])
    const addTodo = async () => {
        await fetchDataPOST()
        await fetchDataGET()

        setUsersTodo(prev => "")
    }

    // Handle completed filter
  return (
    <div className="w-full max-w-2xl font-extrabold text-white border-4  min-h-96
    flex flex-col space-y-10 py-10">

        {/* Add todo area */}
        <div className="w-full primary h-20 flex justify-between">
            <input value={usersTodo} onChange={handleUsersTodo}
            type="text" placeholder="Create new todo" 
            className="h-full px-10 focus:outline-none focus:ring-0 focus:border-gray-300 w-full"/>

            <div className="w-fit px-6 flex justify-center items-center h-full">
                <button onClick={addTodo} className="bg-white text-black px-4 py-2 rounded-md
                hover:scale-105 hover:cursor-pointer hover:brightness-90
                active:brightness-75 transition-all">
                    Add
                </button>
            </div>
        </div>

        {/* Display area */}
        <div className="w-full primary min-h-96">
            {/* filter options */}
            <div className="w-full flex justify-end px-6 space-x-8 py-8 border-b-2 border-gray-500">
                <p className="h-fit hover:scale-105 hover:cursor-pointer hover:brightness-75 transition-all">All</p>
                <p className="h-fit hover:scale-105 hover:cursor-pointer hover:brightness-75 transition-all">Completed</p>
                <p className="h-fit hover:scale-105 hover:cursor-pointer hover:brightness-75 transition-all">Uncompleted</p>
            </div>

            {/* Display todo item */}
            <div className="min-h-32 flex flex-col space-y-4 py-10">
                {dataStorage.map((item: any) => {
                    return <TodoItem isCompleted={item.information.isCompleted} key={item.id} todoName={item.information.todo} id={item.id}/>
                })}
            </div>
        </div>

        {/* Search Todo */}
        <div className="w-full primary h-20 primary">
            <input type="text" placeholder="Search" 
            className="w-full focus:outline-none focus:ring-0 focus:border-gray-300 px-10 h-full" />
        </div>
    </div>
  )
}

export default TodoApp