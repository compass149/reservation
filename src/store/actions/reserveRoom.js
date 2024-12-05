export const reserveRoom = (reservationData) => {
    return {
        type: 'RESERVE_ROOM',
        payload: reservationData,
    };
};
