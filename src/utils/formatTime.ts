const formatChatTime = (time: any) => {
    if (!time) return '';

    const date =
        time?.toDate
            ? time.toDate()
            : new Date(time);

    const now = new Date();

    const isToday =
        date.toDateString() ===
        now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
        date.toDateString() ===
        yesterday.toDateString();

    // TODAY → 06:44 PM
    if (isToday) {
        return date.toLocaleTimeString(
            'en-IN',
            {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            }
        );
    }

    // YESTERDAY
    if (isYesterday) {
        return 'Yesterday';
    }

    // OLDER → 04 Jun 2026
    return date.toLocaleDateString(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }
    );
};

export default formatChatTime;