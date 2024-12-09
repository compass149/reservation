import axios from "axios";
import { BASE_API_URL } from "../common/constants";
import { authHeader } from "./base.service";

const API_URL = BASE_API_URL + "/api/room";
const RESERVATION_API_URL = BASE_API_URL + "/api/reservation"; // 예약 API 엔드포인트 추가

class RoomService {
    saveRoom(room) {
        console.log("Saving room:", room); // 요청 전 로그
        return axios.post(API_URL, room, { headers: authHeader() })
            .then(response => {
                console.log("Room saved successfully:", response.data); // 성공적인 응답 로그
                return response;
            })
            .catch(error => {
                console.error("Error saving room:", error); // 오류 로그
                throw error;
            });
    }

    deleteRoom(room) {
        console.log("Deleting room with ID:", room.id); // 요청 전 로그
        return axios.delete(API_URL + '/' + room.id, { headers: authHeader() })
            .then(response => {
                console.log("Room deleted successfully:", response.data); // 성공적인 응답 로그
                return response;
            })
            .catch(error => {
                console.error("Error deleting room:", error); // 오류 로그
                throw error;
            });
    }

    getAllRooms() {
        console.log("Fetching all rooms..."); // 요청 전 로그
        return axios.get(API_URL)
            .then(response => {
                console.log("Rooms fetched successfully:", response.data); // 성공적인 응답 로그
                return response;
            })
            .catch(error => {
                console.error("Error fetching rooms:", error); // 오류 로그
                throw error;
            });
    }

    // 사용자의 예약 목록을 가져오는 메서드 추가
    getReservationByUser(user) {
        console.log(`Fetching reservation for user with ID: ${user.uid}`);
        return axios.get(`${RESERVATION_API_URL}`, { headers: authHeader() })  // 여기서 ?userId= 부분 제거
          .then(response => {
            console.log(`Reservation fetched successfully for user ${user.uid}:`, response.data);
            return response;
          })
          .catch(error => {
            console.error(`Error fetching reservation for user ${user.uid}:`, error);
            throw error;
          });
      }
      
}

// 클래스 정의 종료 후 내보내기
const roomService = new RoomService();
export default roomService;
