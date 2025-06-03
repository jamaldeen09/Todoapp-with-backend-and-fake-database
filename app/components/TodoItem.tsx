"use client"

import { useEffect,useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash,faCheck } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { addData } from "../redux/dataStorage";


interface TodoSchema {
    todoName: string,
    id: number,
    isCompleted: boolean,
}

const TodoItem = (props: TodoSchema) => {
    // destructuring props
    const { todoName,id,isCompleted } = props

    const deleteDataDELETE = async () => {
        try {
            const response = await fetch(`http://localhost:4080/api/todo/${id}`, {
                method: "DELETE"
            })
            const data = await response.json()
            console.log(
                data
            )
        } catch (err) {
            console.error(err)
        }
    }
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

    const handleDelete = async () => {
        await deleteDataDELETE()
        await fetchDataGET()
    }

    // handling completed
    const handleCompletedPATCH = async () => {
        try {
           const response = await fetch(`http://localhost:4080/api/todo/${id}`, {
             method: "PATCH"
           })
           const data = await response.json();
           console.log(data);
           return data
        } catch (err) {
            console.error(err)
        }
    }

    const handleCompleted = async () => {
        await handleCompletedPATCH();
        await fetchDataGET();
        if (!handleCompletedPATCH)
            return;
    }
  return (
    <div className="w-full border-b-2 border-gray-500 flex justify-between px-10 h-18 items-center">

        {/* todo name */}
        <div className="w-fit font-extrabold text-white flex space-x-8 items-center">
            <label className="cursor-pointer relative">
               <input id="checkbox-1"
               onChange={handleCompleted}
               type="checkbox" 
               style={{width: "0.8rem", height: "0.8rem"}} 
               className={`appearance-none scale-200 border rounded-full  primary
               `}
               />
               <FontAwesomeIcon style={{top: "0.3rem", right: "-0.01rem"}} icon={faCheck} 
               className={`text-white absolute top-0 transition ${isCompleted ? "check-1" : "opacity-0" } text-sm`}/>
            </label>
            <h1 className={`text-xl ${isCompleted ? "line-through" : null}`}>{todoName || "None"}</h1>
        </div>

        {/* Icons */}
        <div className="w-fit flex space-x-10 items-center">
             <FontAwesomeIcon
             onClick={handleDelete}
             icon={faTrash} 
             className="text-red-600 text-xl hover:scale-110 hover:brightness-90 active:brightness-75 transition-all hover:cursor-pointer"/>
             <FontAwesomeIcon icon={faEdit} className="text-xl hover:scale-110 hover:brightness-90 active:brightness-75 transition-all hover:cursor-pointer"/>
        </div>
    </div>
  )
}

export default TodoItem