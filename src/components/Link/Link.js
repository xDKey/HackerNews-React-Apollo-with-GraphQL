import { gql, useMutation } from "@apollo/client"
import { AUTH_TOKEN, LINKS_PER_PAGE, 
    // LINKS_PER_PAGE 
} from "../../constants"
import { timeDifferenceForDate } from '../../utils'
import './Link.css'
import { FEED_QUERY } from '../LinkList/LinkList'

const authToken = localStorage.getItem(AUTH_TOKEN)

const VOTE_MUTATION = gql`
mutation VoteMutation ($linkId: ID!) {
    vote(linkId: $linkId){
        id
        link {
            id
            votes {
                id
                user {
                    id
                }
            }
        }
        user {
            id
        }
    }
}
`

const Link = ({ link, index }) => {
    const take = LINKS_PER_PAGE
    const skip = 0
    const orderBy = { createdAt: 'desc' }

    const [vote] = useMutation(VOTE_MUTATION, {
        variables: {
            linkId: link.id     
        },
        update(cache, { data: { vote } }){
            const { feed } = cache.readQuery({ 
                query: FEED_QUERY,
                variables: { take, skip, orderBy }
            })

            const updatedLinks = feed.links.map( feedLink => {
                if (feedLink.id === link.id) return { ...feedLink, votes: [...feedLink.votes, vote] }
                return feedLink
            } )

            cache.writeQuery({
                query: FEED_QUERY,
                data: {
                    feed: {
                        links: updatedLinks
                    }
                },
                variables: { take, skip, orderBy }
            })
        }
    })

    return (
        <div className='link'>
            <div className='link__header'>
                <span>{index + 1}</span>
                {authToken && (
                    <div onClick={ vote } className='link__vote'>
                        ▲
                    </div>
                )}
            </div>
            <div>
                <div>
                    {link.description} (<a href={link.url}>{link.url}</a>)
                    
                </div>
                {authToken && (
                    <div>
                        {link.votes.length} votes | by {' '}
                        {link.postedBy ? link.postedBy.name : 'Unknown'}{' '}
                        {timeDifferenceForDate(link.createdAt)}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Link