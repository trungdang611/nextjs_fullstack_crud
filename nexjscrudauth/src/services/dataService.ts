// services/dataService.ts
import axios from "axios";

const API_URL = "http://localhost:3000/data";

export default {
  fetchData: async () => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  },

  addData: async (newData: any) => {
    try {
      const res = await axios.post(API_URL, newData);
      return res.data;
    } catch (err) {
      console.error("Add error:", err);
      throw err;
    }
  },

  updateData: async (id: string | number, updatedData: any) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updatedData);
      return res.data;
    } catch (err) {
      console.error("Update error:", err);
      throw err;
    }
  },

  deleteData: async (id: string | number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (err) {
      console.error("Delete error:", err);
      throw err;
    }
  },
};
