export const calculateDistance = async (dataUser: any, dataLocation: any) => {
    const lat1 = dataUser.lat * Math.PI / 180;
    const lng1 = dataUser.lng * Math.PI / 180;
    const lat2 = dataLocation.lat * Math.PI / 180;
    const lng2 = dataLocation.lng * Math.PI / 180;

    const R = 6371e3;

    const Δφ = lat2 - lat1;
    const Δλ = lng2 - lng1;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return Math.round(distance);
}