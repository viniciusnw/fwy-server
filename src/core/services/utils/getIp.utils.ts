export const getIpAddress = (req): string => {
    const headers = req.headers;
    if (!headers) return null;
    const ip = headers['x-forwarded-for'];
    if (!ip) return null;
    return ip;
};