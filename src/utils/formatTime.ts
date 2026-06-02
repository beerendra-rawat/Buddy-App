export const formatTime = (
    time: any
) => {

    if (!time) {
        return '';
    }

    const date =
        time.toDate();

    return date.toLocaleTimeString(
        [],
        {
            hour: '2-digit',
            minute: '2-digit',
        }
    );
};