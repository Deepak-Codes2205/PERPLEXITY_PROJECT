import { useDispatch } from 'react-redux'
import { register, login, getMe } from '../service/auth.api'
import {setUser, setLoading, setError} from '../auth.slice'

export function useAuth() {
    const dispatch = useDispatch()

    async function handleRegister(username, email, password) {
        try {
            dispatch(setLoading(true))
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
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed"))
        } finally {
            dispatch(setLoading(false))
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
        }   finally { 
            dispatch(setLoading(false))
        }
    }


    return { handleRegister, handleLogin, handleGetMe }
}
