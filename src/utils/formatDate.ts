// export const formatDate = ({ date, config }: { date: string, config?: Intl.DateTimeFormatOptions }) => {
//     const defaultOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: 'short', year: 'numeric' }
//     const options = { ...defaultOptions, ...config }

//     return new Date(date).toLocaleDateString('en-US', options)
// }

export const formatDate = ({
    date,
    config,
}: {
    date: string;
    config?: Intl.DateTimeFormatOptions;
}) => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    };

    return new Date(date).toLocaleDateString('en-US', {
        ...defaultOptions,
        ...config,
    });
};

export const formatTime = ({
    time,
    config,
}: {
    time: string;
    config?: Intl.DateTimeFormatOptions;
}) => {
    if (!time) return '';

    const defaultOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    const date = new Date(`1970-01-01T${time}`);

    if (isNaN(date.getTime())) return 'Invalid Time';

    return date.toLocaleTimeString('en-US', {
        ...defaultOptions,
        ...config,
    });
};