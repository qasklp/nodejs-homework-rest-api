const errorMessages = {
    400: "Bad request",
    401: "Unauthorised",
    403: "Forbidden",
    404: "Not found",
    409: "Conflict"
}

const HttpError = (status, message = errorMessages[status]) => {
    const error = new Error(message)
    error.status = status;
    return error;
}

module.exports = HttpError;