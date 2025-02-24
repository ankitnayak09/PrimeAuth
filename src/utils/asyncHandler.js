/*
    * a higher-order func which returns an async function
    * in the returned async func it tries to executre the fn func
    * if error is thrown during the fn func call, it's caught by the catch block.
*/
const asyncHandler = (fn) => async (req,res,next) => {
    try {
        await fn(req,res,next);
    } catch (err) {
        res.status(err.code | 500).json({
            success: false,
            message: err.message
        })
    }
}

export default asyncHandler;