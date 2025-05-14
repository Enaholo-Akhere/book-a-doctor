export const formatDate = ({ date, config }: { date: string, config?: Intl.DateTimeFormatOptions }) => {
    const defaultOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: 'short', year: 'numeric' }
    const options = { ...defaultOptions, ...config }

    return new Date(date).toLocaleDateString('en-US', options)
}