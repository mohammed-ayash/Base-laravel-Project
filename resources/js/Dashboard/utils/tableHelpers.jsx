export function getStatusColor(status) {
  switch (status) {
    case 'Completed':
      return 'success'
      break

    case 'Paid':
      return 'success'
      break

    case 'Canceled':
      return 'error'
      break
    case 'Expired':
      return 'error'
      break
    case 'Rejected':
      return 'error'
      break

    default:
      break
  }
}
