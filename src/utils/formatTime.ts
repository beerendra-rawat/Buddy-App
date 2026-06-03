const formatTime = (time: any) => {

    if (!time) {
        return '';
    }

    const date =
        time?.toDate
            ? time.toDate()
            : new Date(time);

    // TIME
    const formattedTime =
        date.toLocaleTimeString(
            'en-IN',
            {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            }
        );

    // DATE
    const formattedDate =
        date.toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }
        );

    // TIME ABOVE DATE
    return `${formattedTime}\n${formattedDate}`;
};

export default formatTime;