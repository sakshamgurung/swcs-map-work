import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {apiConfig} from './apiConfig'

export const loggedInClient = axios.create({
    baseURL:apiConfig.devBaseUrl
});

export const getLoggedinClient = async() => {
    return loggedInClient;
}
