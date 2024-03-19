module.exports = (date = new Date()) => {
    const current = new Date();
    const msg = new Date(date);

    const today = (current.getFullYear() === msg.getFullYear() && current.getMonth() === msg.getMonth() && current.getDate() === msg.getDate());
    const yesterday = (current.getFullYear() === msg.getFullYear() && current.getMonth() === msg.getMonth() && current.getDate() - 1 === msg.getDate());

    if (today) {
        return `Today at ${new Date(date).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (yesterday) {
        return `Yesterday at ${new Date(date).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else {
        return new Date(date).toLocaleString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).replace(',', '').toLocaleUpperCase();;
    }
}