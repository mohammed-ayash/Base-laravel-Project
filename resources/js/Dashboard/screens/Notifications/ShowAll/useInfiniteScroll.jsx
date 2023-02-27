import {useClient} from '@/context/auth-context'
import queryString from 'query-string'
import {useState, useEffect} from 'react'
import {useQuery} from 'react-query'

const useInfiniteScroll = (page, value) => {
  const client = useClient()
  const [notifications, setNotifications] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const fetchDataOptions = {
    page: page || 1,
    limit: 10,
    read: value ? 'false' : undefined,
  }
  const {isLoading, isError, refetch} = useQuery(
    ['my-notifications', fetchDataOptions],
    () =>
      client(
        `notifications/my-notifications?${queryString.stringify(
          fetchDataOptions,
        )}`,
      ).then(data => {
        setHasMore(data?.pagination?.pages - page > 0)
        setNotifications(prev => [...prev, ...data?.pagination?.items])
      }),
    {enabled: false},
  )

  useEffect(() => {
    setNotifications([])
    refetch()
  }, [value])

  useEffect(() => {
    refetch()
  }, [page])

  return {isLoading, isError, notifications, hasMore}
}

export default useInfiniteScroll
