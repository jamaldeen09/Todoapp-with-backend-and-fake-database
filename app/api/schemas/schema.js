
const todoSchema = {
    todo: {
        isString: {
            errorMessage: "Invalid todoName"
        },
        isLength: {
            options: {min: 1, max: Infinity},
            errorMessage: "Todo must be at least 1 character"
        },
    },

    isCompleted: {
        isBoolean: {
            errorMessage: "Must be true or false",
        },
        notEmpty: {
            errorMessage: "Cannot be empty"
        }
    },
}

module.exports = todoSchema;