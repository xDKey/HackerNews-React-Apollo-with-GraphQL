import { useState } from "react"
import { gql, useMutation } from '@apollo/client'
import { useHistory } from "react-router"
import { LINKS_PER_PAGE } from "../../constants"
import { FEED_QUERY } from "../LinkList/LinkList"

const LinkCreate = () => {
    const [formState, setFormState] = useState({
        description: '',
        url: ''
    })

    const CREATE_LINK_MUTATION = gql`
        mutation PostMutation(
            $description: String!
            $url: String!
        ) {
            post(description: $description, url: $url){
                id
            }
        }
    `
    const history = useHistory()

    const {description, url} = formState
    const [createLink] = useMutation(CREATE_LINK_MUTATION, {
        variables: {description, url},
        update: (cache, { data: { post } }) => {
            const take = LINKS_PER_PAGE
            const skip = 0
            const orderBy = { createdAt: 'desc' }

            const data = cache.readQuery({
                query: FEED_QUERY,
                variables: {
                    take,
                    skip,
                    orderBy
                }
            })

            cache.writeQuery({
                query: FEED_QUERY,
                data: {
                    feed: {
                        links: [post, ...data.feed.links]
                    }
                },
                variables: {
                    take,
                    skip,
                    orderBy
                }
            })
        },
        onCompleted: () => history.push('/new/1')
    })
    
    return(
        <form 
            onSubmit={event => {
                            event.preventDefault()
                            createLink()
            }}
        >
            <p>Add new Link:</p>
            <input 
                type='text' 
                placeholder='A description for the link' 
                value={ formState.description } 
                onChange={({ target }) => setFormState({ ...formState, description: target.value })}
            />
            <input 
                type='text' 
                placeholder='The URL for the link' 
                value={formState.url} 
                onChange={({ target }) => setFormState({ ...formState, url: target.value })}
            />
            <button type='submit'>Add</button>
        </form>
        )
}

export default LinkCreate