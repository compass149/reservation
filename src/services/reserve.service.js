import axios from 'axios';
import {BASE_API_URL} from '../common/constants';
import { authHeader } from './base.service';

const API_URL=BASE_API_URL + '/api/reservation';

class ReserveService{
    saveReservationService(reserve){
        return axios.post(API_URL, reserve, {headers:authHeader()});
    }

    getAllReservations(){
        return axios.get(API_URL,{headers:authHeader()});
    }
}
const reserveService =new ReserveService();
export default reserveService;