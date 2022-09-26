export const loginErrorCheck = (error) => {
    switch(error){
        case "(auth/invalid-email).":
            return {
                message: 'Email is invalid'
            }
        case "(auth/user-not-found).":
            return {
                message: 'No user found for this email/password'
            }
        case "(auth/wrong-password).":
            return {
                message: 'Incorrect password'
            }
        default: 
        return {
            message: 'Please input correct email/password'
        }
    }
}

export const registerErrorCheck = (error) => {
    switch(error){
        case "(auth/invalid-email).":
            return {
                message: 'Email is invalid'
            }
        case "(auth/email-already-in-use).":
            return {
                message: 'Email is already in use'
            }
        case "(auth/weak-password).":
            return {
                message: 'Password should be at least 6 characters'
            }
        default:
            return {
                message: 'Please fill all the fields'
            }
    }
}