const express = require("express")
const app = express();
const PORT = process.env.PORT || 4080;
const { validationResult,checkSchema,matchedData,param,body,query } = require("express-validator")
const database  = require("./database/database");
const cors = require("cors")
const  todoSchema  = require("./schemas/schema")
let uniqueId = 0


app.use(express.json());
app.use(cors())


app.get("/api/todo", (request, response) => {
    return response.status(200).send(
        {
            msg: "Successfull",
            database: database,
        }
    )
})

app.post("/api/todo", checkSchema(todoSchema) , (request, response) => {
    uniqueId++
    const validationRes = validationResult(request);
    const isValid = validationRes.isEmpty();

    if (!isValid)
        return response.status(400).send(validationRes.array())

    const data = matchedData(request); // [ {id: 1, information: {} }]
    const newTodo = {
        id: database.length,
        information: data
    }
    database.push(newTodo);
    return response.status(200).send(
        {
            msg: "Todo Sucessfully added",
            todo: newTodo
        }
    )
})

app.patch("/api/todo/:id",  param("id").isString().notEmpty(), (request, response) => {
    const validationRes = validationResult(request);
    const isValid = validationRes.isEmpty()

    if (!isValid)
        return response.status(400).send(validationRes.array())

    const data = matchedData(request);
    const parsedId = parseInt(data.id)
    console.log(parsedId)
 
    const itemsIndex = database.findIndex(item => item.id === parsedId);

    if (itemsIndex === -1) {
        return response.status(400).send({msg: "Item was not found!"})
    } else {
        // { id: 1, information: {todo: something, isCompleted: false } }
        database[itemsIndex] = {...database[itemsIndex] , ...database[itemsIndex].information.isCompleted = !database[itemsIndex].information.isCompleted}
        return response.status(200).send(
            {
                msg: "Item updated sucessfully",
                updatedItem: database[itemsIndex]
            }
        )
    }
})


app.delete("/api/todo/:id" , param("id").isString() , (request, response) => {

    const validationRes = validationResult(request);
    const isValid = validationRes.isEmpty()

    if (!isValid)
        return response.status(400).send(validationRes.array())

    const data = matchedData(request);
    const getId = parseInt(data.id);

    const findItem = database.findIndex(item => item.id === getId);

    if (findItem === -1) {
        return response.status(404).send({msg: "Item was not found"})
    } else {
        database.splice(findItem, 1);
        return response.status(404).send(
            {
                msg: "Successfully Deleted",
                item: database[findItem]
            }
        )
    }
})

app.listen(PORT, () => console.log(`Port: ${PORT} is being listened to`))
