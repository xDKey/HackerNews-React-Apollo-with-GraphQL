import { useState } from "react"
import { gql, useMutation } from '@apollo/client'
import { AUTH_TOKEN } from '../../constants'
import { useHistory } from "react-router"

const Login = () => {
    const [formState, setFormState] = useState({
        login: true,
        email: '',
        password: '',
        name: ''
    })
    const history = useHistory()

    const SIGNUP_MUTATION = gql`
    mutation SignupMutation(
      $email: String!
      $password: String!
      $name: String!
    ) {
      signup(
        email: $email
        password: $password
        name: $name
      ) {
        token
      }
    }
    `
    const LOGIN_MUTATION = gql`
    mutation LoginMutation(
        $email: String!
        $password: String!
    ) {
        login(email: $email, password: $password) {
            token
        }
    }
    `
    const {email, password, name} = formState

    const [login] = useMutation(LOGIN_MUTATION, {
        variables: { email, password },
        onCompleted: ({ login }) => {
            localStorage.setItem(AUTH_TOKEN, login.token)
            history.push('/')
        }
    })
    
    const [signup] = useMutation(SIGNUP_MUTATION, {
        variables: { email, password, name },
        onCompleted: ({ signup }) => {
            localStorage.setItem(AUTH_TOKEN, signup.token)
            history.push('/')
        }
    })

    return(
        <div>
            <h4>
                {formState.login ? 'Login' : 'Sign Up'}
            </h4>
            <form>
                {!formState.login && (
                    <input 
                        value={formState.name}
                        type='text'
                        placeholder='Your name'
                        onChange={({target}) => {
                            setFormState({
                                ...formState,
                                name: target.value
                            })
                        }}
                    />
                )}
                <input 
                    value={formState.email}
                    type='text'
                    placeholder='Your Email'
                    onChange={ ({target}) => {
                        setFormState({
                            ...formState,
                            email: target.value
                        })
                    }}
                />
                <input 
                    value={formState.password}
                    type='password'
                    placeholder='Your password'
                    onChange={ ({target}) => {
                        setFormState({
                            ...formState,
                            password: target.value
                        })
                    }}
                />
            </form>
            <div>
                <button
                    onClick={formState.login ? login : signup}
                >
                    {formState.login ? 'login' : 'create account'}
                </button>

                <button
                    onClick={() =>
                        setFormState({
                        ...formState,
                        login: !formState.login
                    })
                }
                >
                    {formState.login
                        ? 'need to create an account?'
                        : 'already have an account?'}
                </button>
            </div>
        </div>
    )
}

export default Login