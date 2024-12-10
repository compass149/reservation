import axios from "axios";
import { BASE_API_URL } from "../common/constants";
import { authHeader } from "./base.service";

const API_URL = BASE_API_URL + "/api/room";
const RESERVATION_API_URL = BASE_API_URL + "/api/reservation";

function parseErrorMessage(error) {
    if (error.response && error.response.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
            return data;
        } else if (data.message) {
            return data.message;
        }
    }
    return error.message || 'Unknown error occurred.';
}

class RoomService {
    createRoom(formData) {
        console.log("Creating room...");
        return axios.post(API_URL, formData, {
            headers: {
                ...authHeader(),
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log("Room created successfully:", response.data);
            return response;
        })
        .catch(error => {
            const errorMsg = parseErrorMessage(error);
            console.error("Error creating room:", errorMsg);
            throw new Error(errorMsg);
        });
    }

    updateRoom(id, formData) {
        console.log("Updating room with ID:", id);
        return axios.put(`${API_URL}/${id}`, formData, {
            headers: {
                ...authHeader(),
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log("Room updated successfully:", response.data);
            return response;
        })
        .catch(error => {
            const errorMsg = parseErrorMessage(error);
            console.error("Error updating room:", errorMsg);
            throw new Error(errorMsg);
        });
    }

    saveRoom(formData) {
        // formData에 id가 있는지 확인
        const hasId = formData.has('id') && formData.get('id') > 0;
        if (hasId) {
            const roomId = formData.get('id');
            return this.updateRoom(roomId, formData);
        } else {
            return this.createRoom(formData);
        }
    }

    deleteRoom(room) {
        console.log("Deleting room with ID:", room.id);
        return axios.delete(`${API_URL}/${room.id}`, { headers: authHeader() })
            .then(response => {
                console.log("Room deleted successfully:", response.data);
                return response;
            })
            .catch(error => {
                const errorMsg = parseErrorMessage(error);
                console.error("Error deleting room:", errorMsg);
                throw new Error(errorMsg);
            });
    }

    getAllRooms() {
        console.log("Fetching all rooms...");
        return axios.get(API_URL)
            .then(response => {
                console.log("Rooms fetched successfully:", response.data);
                return response;
            })
            .catch(error => {
                const errorMsg = parseErrorMessage(error);
                console.error("Error fetching rooms:", errorMsg);
                throw new Error(errorMsg);
            });
    }

    getRoomById(id) {
        console.log(`Fetching room with ID: ${id}`);
        return axios.get(`${API_URL}/${id}`)
            .then(response => {
                console.log(`Room fetched successfully (ID: ${id}):`, response.data);
                return response;
            })
            .catch(error => {
                const errorMsg = parseErrorMessage(error);
                console.error(`Error fetching room (ID: ${id}):`, errorMsg);
                throw new Error(errorMsg);
            });
    }

    getReservationByUser(user) {
        console.log(`Fetching reservation for user with ID: ${user.uid}`);
        return axios.get(RESERVATION_API_URL, { headers: authHeader() })
          .then(response => {
            console.log(`Reservation fetched successfully for user ${user.uid}:`, response.data);
            return response;
          })
          .catch(error => {
            const errorMsg = parseErrorMessage(error);
            console.error(`Error fetching reservation for user ${user.uid}:`, errorMsg);
            throw new Error(errorMsg);
          });
    }

    cancelReservation(rsvId) {
        console.log(`Cancelling reservation with ID: ${rsvId}`);
        return axios.delete(`${RESERVATION_API_URL}/${rsvId}`, { headers: authHeader() })
            .then(response => {
                console.log("Reservation cancelled successfully:", response.data);
                return response;
            })
            .catch(error => {
                const errorMsg = parseErrorMessage(error);
                console.error("Error cancelling reservation:", errorMsg);
                throw new Error(errorMsg);
            });
    }
}

const roomService = new RoomService();
export default roomService;
