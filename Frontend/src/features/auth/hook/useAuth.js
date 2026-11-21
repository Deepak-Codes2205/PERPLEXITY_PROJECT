//HOOK LAYER
import { useDispatch } from 'react-redux'
import { register, login, getMe, resendVerificationEmail } from '../service/auth.api'
import { setUser, setLoading, setError } from '../auth.slice'

export function useAuth() {
    const dispatch = useDispatch()

    async function handleRegister(username, email, password) {
        try {
            dispatch(setLoading(true))
            //uSER DATA WILL NOT RETURN ON REGISTERING AS USER NEEDS TO VERIFY THEIR EMAIL ADDRESS
            await register(username, email, password)
            //dispatch(setUser(data))
            return true
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"))
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin(email, password) {

        try {
            dispatch(setLoading(true))
            const data = await login(email, password)
            dispatch(setUser(data))
            return true
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed"))
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleResendVerificationEmail(email) {
        try {
            const data = await resendVerificationEmail(email)
            return {
                ok: true,
                message: data.message || "Verification email sent successfully",
            }
        } catch (error) {
            return {
                ok: false,
                message: error.response?.data?.message || "Could not send the verification email. Please try again.",
            }
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            console.log('getMe response:', data) // 👈 add this
            dispatch(setUser(data))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch user data"))
        } finally {
            dispatch(setLoading(false))
        }
    }


    return { handleRegister, handleLogin, handleGetMe, handleResendVerificationEmail }
}
