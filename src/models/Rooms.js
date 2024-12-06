export default class Rooms {
    constructor(rId, roomName,price ,description, roomType,capacity, createdAt,updatedAt) {
      /**방 고유 id (pk)**/
      this.rId = rId;
      this.roomName = roomName;
      this.description = description;
      this.price = price;
      this.capacity = capacity;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    };
  };