export default class RoomImage{
    constructor(uuid, fileName, ord, rooms) {
        /**사진 고유 ID (Primary Key)**/
        this.uuid = uuid;
        /**사용자 로그인 id**/
        this.fileName = fileName;
        this.ord = ord;
        this.rooms = rooms;        
    }
}