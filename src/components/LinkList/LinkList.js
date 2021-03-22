import Link from '../Link/Link'
import { useQuery, gql } from '@apollo/client'
import { LINKS_PER_PAGE } from '../../constants'
import { useHistory } from 'react-router'
import './LinkList.css'

export const FEED_QUERY = gql`
    query FeedQuery(
        $take: Int
        $skip: Int
        $orderBy: LinkOrderByInput
    ){
        feed(
            take: $take,
            skip: $skip,
            orderBy: $orderBy
        ) {
            count
            links {
                id
                createdAt
                description
                url
                postedBy {
                    id
                    name
                }
                votes {
                    id
                    user {
                        id
                    }
                }
            }
        }
    }
    `
const NEW_LINKS_SUBSCRIPTION = gql`
    subscription {
      newLink {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  `

const getQueryVariables = (isNewPage, page) => {
    const take = isNewPage ? LINKS_PER_PAGE : 100
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const orderBy = { createdAt: 'desc' }
    return { take, skip, orderBy }
}

const getLinkToRender = (isNewPage, data) => {
    if (isNewPage) return data.feed.links
    const rankedLinks = data.feed.links.slice()
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
    return rankedLinks
}
    
const LinkList = () => {
    const history = useHistory()
    const isNewPage = history.location.pathname.includes('new')
    const pageIndexParams = history.location.pathname.split('/')
    const page = +pageIndexParams[pageIndexParams.length - 1]
    const pageIndex = page ? (page-1) * LINKS_PER_PAGE : 0

    const { 
        data,
        loading,
        // error,
        subscribeToMore 
    } = useQuery(FEED_QUERY, {
        variables: getQueryVariables(isNewPage, page)
    })

    subscribeToMore({
        document: NEW_LINKS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev

            const newLink = subscriptionData.data.newLink
            const exists = prev.feed.links.find(({ id }) => id === newLink.id)
            if (exists) return prev

            return Object.assign({}, prev, {
                feed: {
                    links: [newLink, ...prev.feed.links],
                    count: prev.feed.links.length + 1,
                    __typename: prev.feed.__typename
                }
            })
        }
    })

    return(
        <>
            {loading && <p>Loading...</p>}
            {data && (
                <>
                    {getLinkToRender(isNewPage, data).map(
                        (link, index) => <Link 
                                            key={link.id} 
                                            link={link} 
                                            index={index + pageIndex}
                                        />
                    )}

                    {isNewPage && (
                        <div className='navigation'>
                            <div 
                                className='navigation__button' 
                                onClick={() => {
                                    if (page > 1) history.push(`/new/${page-1}`)
                            }}>
                                Previous
                            </div>
                            <div 
                                className='navigation__button' 
                                onClick={() => {
                                    if (page <= data.feed.count / LINKS_PER_PAGE) history.push(`/new/${page+1}`)
                            }}>
                                Next
                            </div>
                        </div>
                    )}

                </>
            )}
        </>
    )
}

export default LinkList