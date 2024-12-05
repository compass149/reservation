import axios from "axios";
import { BASE_API_URL } from "../common/constants";
import { authHeader } from "./base.service";

const API_URL=BASE_API_URL+"/api/room";

class RoomService {
    saveRoom(room) {
        return axios.post(API_URL, room, {headers:authHeader() });
    }

    deleteRoom(room){
        return axios.delete(API_URL + '/' + room.id, {headers:authHeader()});
    }

    getAllRooms() {
        return axios.get(API_URL);
    }
}
const roomService = new RoomService();
export default roomService;