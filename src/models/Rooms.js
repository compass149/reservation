export default class Rooms {
    constructor(rId, roomName, description, roomType,capacity, createdAt,updatedAt) {
      /**방 고유 id (pk)**/
      this.rId = rId;
      this.roomName = roomName;
      this.description = description;
      /**방 타입(성별로 구분)**/
      this.roomType = roomType;
      this.capacity = capacity;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    };
  };