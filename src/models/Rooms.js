export default class Rooms {
    constructor(id, roomName,price ,description, imageUrls ,capacity, createdAt,updatedAt) {
      /**방 고유 id (pk)**/
      this.id = id;
      this.roomName = roomName;
      this.description = description;
      this.price = price;
      this.capacity = capacity;
      this.imageUrls = imageUrls;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    };
  };