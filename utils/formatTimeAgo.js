import { formatDistanceToNow } from 'date-fns'

export const formatTimeAgo = (timestamp) => {
  return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true }).replace('about ', '')
}
