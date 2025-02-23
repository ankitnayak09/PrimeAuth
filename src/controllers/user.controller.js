const signupUser = (req,res) => {
    // * Fetch Fields from req body: email,fullName,username
    // * Check if user already exist, if yes then return res
    // * create user
    // * remove password field and return
    return res.status(201).json({
        success: true,
    })
}

export {signupUser}