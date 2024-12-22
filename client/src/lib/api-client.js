import { HOST } from "@/utils/constants";
import axios from "axios";


export const apiClient = axios.create({
    baseURL:import.meta.env.MODE === "development" ? "http://localhost:4000" : "",

});

 