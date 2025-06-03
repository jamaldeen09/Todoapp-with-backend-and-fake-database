
"use client"

import TodoItem from "./TodoItem"
import { useEffect,useState,useRef } from "react"
import { useSelector,useDispatch } from "react-redux"
import { addData } from "../redux/dataStorage"
import { deactivateModal } from "../redux/modalActivator"

const TodoApp = () => {

    // handle ref
    const focusRef = useRef<null | any> (null);

    useEffect (() => {
        focusRef.current.focus
    }, [])
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
            dispatch(addData(data.database)) ;
            
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

    // Handle modal
    const modalActivator = useSelector(state => state?.activator.modalActivator)

    const gottenData = useSelector(state => state?.data.dataGotten);

    const updateTodoPATCH = async () => {
        try {
            const response = await fetch (`http://localhost:4080/api/todo/update-name/${gottenData.id}`, {
                method: "PATCH",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify({todo : newTodo})
            })
            const data = await response.json();
            console.log(data);
        } catch (err) {
            console.error(err)
        }
    }
    const handleUpdate = async () => {
        await updateTodoPATCH()
        await fetchDataGET()
        dispatch(deactivateModal())
    }

    const [ newTodo,setNewTodo ] = useState<string>("")
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodo(prev => e.target.value)
    }

    // filter options functions
    const [ comp,setComp ] = useState<boolean>(false)
    const [ unComp,setUnComp ] = useState<boolean>(false)
    const [ all,setAll ] = useState<boolean>(false)

    const handleShowAll = () => {
        setAll(prev => true)
        setComp(prev => false)
        setUnComp(prev => false)
    }

    const handleShowCompleted = () => {
        setAll(prev => false)
        setComp(prev => true)
        setUnComp(prev => false)
    }

    const handleShowUncompleted = () => {
        setAll(prev => false)
        setComp(prev => false)
        setUnComp(prev => true)
    }

    // handleSearchbar
    const [ search,setSearch ] = useState<string>("");
    const [ seenSearch,setSeenSearch ] = useState<any>({});

    const getSearch = async () => {
        try {
            const response = await fetch(`http://localhost:4080/api/todo/search/${search}`, {
                method: "GET"
            })
            const data = await response.json();
            console.log(data);
            setSeenSearch((prev: any) => data.item);
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (search.trim() !== "") {
          getSearch();
        }
    }, [search])
  return (
    <>
    <div className="w-full max-w-2xl font-extrabold text-white border-4  min-h-96
    flex flex-col space-y-10 py-10">

        {/* Add todo area */}
        <div className="w-full primary h-20 flex justify-between">
            <input ref={focusRef} value={usersTodo} onChange={handleUsersTodo}
            type="text" placeholder="Create new todo" 
            className="h-full px-10 focus:outline-none focus:ring-0 w-full"/>

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
                <p 
                onClick={handleShowAll}
                className="h-fit hover:scale-105 hover:cursor-pointer hover:brightness-75 transition-all">All</p>
                <p 
                onClick={handleShowCompleted}
                className="h-fit hover:scale-105 hover:cursor-pointer hover:brightness-75 transition-all">Completed</p>
                <p 
                onClick={handleShowUncompleted}
                className="h-fit hover:scale-105 hover:cursor-pointer hover:brightness-75 transition-all">Uncompleted</p>
            </div>

            {/* Display todo item */}
            {/* return <TodoItem isCompleted={item.information.isCompleted} key={item.id} todoName={item.information.todo} id={item.id}/> */}
            <div className="min-h-32 flex flex-col space-y-4 py-10">
                {
                    search.trim() !== "" && seenSearch && seenSearch.information ? (
                        <TodoItem
                          isCompleted={seenSearch.information.isCompleted}
                          key={seenSearch.id}
                          todoName={seenSearch.information.todo}
                          id={seenSearch.id}
                        />
                    ) : all ? dataStorage.map((item: any) => {
                        return <TodoItem isCompleted={item.information.isCompleted} key={item.id} todoName={item.information.todo} id={item.id}/>
                    }) : comp ? dataStorage.map((item: any) => {
                        if (item.information.isCompleted) {
                            return <TodoItem isCompleted={item.information.isCompleted} key={item.id} todoName={item.information.todo} id={item.id}/>
                        } else {
                            return null
                        }
                            
                    }) : unComp ? dataStorage.map((item: any) => {
                        if (!item.information.isCompleted) {
                            return <TodoItem isCompleted={item.information.isCompleted} key={item.id} todoName={item.information.todo} id={item.id}/>
                        } else {
                            return null
                        }
                    }) : dataStorage.map((item: any) => {
                        return <TodoItem isCompleted={item.information.isCompleted} key={item.id} todoName={item.information.todo} id={item.id}/>
                    })
                }
            </div>
        </div>

        {/* Search Todo */}
        <div className="w-full primary h-20 primary">
            <input 
            value={search}
            onChange={(e) => setSearch(prev => e.target.value)}
            type="text" placeholder="Search" 
            className="w-full focus:outline-none focus:ring-0 focus:border-gray-300 px-10 h-full" 
            />
        </div>
    </div>

    {/* MODAL */}
    <div className={`${modalActivator ? "flex" : "hidden"} inset-0 absolute w-full flex justify-center items-center bg-black/70`}>
         
         <div className="bg-white w-full max-w-xl rounded-xl shadow-xl h-96 hover:scale-105 transition-all">

            {/* Modal title */}
            <div className="w-full px-10 flex py-8 justify-between">
                <h1 className=".primary-text text-2xl font-extrabold">Update Todo</h1>
                <button 
                onClick={handleUpdate}
                className="bg-black text-white px-4 py-2 rounded-md shaodw-xl hover:scale-105 hover:brightness-90
                active:brightness-75 transition-all hover:cursor-pointer font-extrabold">
                    Update
                </button>
            </div>

            {/* Modal BODY */}
            <div className="w-full h-64 px-10">
                <input value={newTodo} onChange={handleOnChange} type="text" placeholder="New Todo"
                className="
                rounded-xl shadow-xl w-full focus:outline-none focus:ring-0 focus:border-black border-2 border-black px-10 pb-44 py-10"/>
            </div>
         </div>
    </div>
    </>
  )
}

export default TodoApp