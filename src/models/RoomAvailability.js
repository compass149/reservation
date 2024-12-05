export default class RoomAvailability {
    constructor(id, roomId,date, event, isAvailable) {
        /**예약 가능 데이터 ID, PK**/
        this.id = id;
        /**방 ID , FK 외래 키 설정:room_id → rooms.id**/
        this.roomId = roomId;
        /**날짜**/
        this.date = date;
        /**이벤트**/
        this.event = event;
        /**예약 가능 여부**/
        this.isAvailable = isAvailable;
    };
  };
