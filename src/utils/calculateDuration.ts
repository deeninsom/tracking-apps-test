export function calculateDuration(startTime: any, endTime: any) {
    const duration = (endTime - startTime) / (1000 * 60 * 60);
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    return `${hours}hr ${minutes}min`;
}