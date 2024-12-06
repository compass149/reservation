export default class Reservation {
    constructor(rsvId, username, roomId, checkIn, checkOut, totalPrice,
                 status, createdAt, updatedAt) {
      /**예약 고유 ID (PK)**/
      this.rsvId=rsvId;
      /**예약한 사용자 ID user_id → users.id(FK)**/
      this.username=username;
      /**예약된 방 id (FK) room_id → rooms.id**/
      this.roomId = roomId;
      this.checkIn = checkIn;
      this.checkOut = checkOut;
      this.totalPrice = totalPrice;
      /**ENUM('대기', '완료', '취소')**/
      this.status = status;
      this.createdAt =createdAt;
      this.updatedAt =updatedAt;
    };
  };