export interface ResponseError {
    success: boolean
    error: {
        message: string,
        code: number,
    }
}

export const newResponseError = (message: string, code: number): ResponseError => {
    return {
        success: false,
        error: {
            message: message,
            code: code
        }
    }
}
