import axios from "axios";
import { useUserStore } from "@/data/UserStore";

export const authAxios = () => {
  const { user } = useUserStore.getState();

  if (!user?.jwt) {
    throw new Error("No hay usuario autenticado");
  }

  return axios.create({
    baseURL: "http://localhost:1337/api", // ⚠️ Cambia si usás otro host
    headers: {
      Authorization: `Bearer ${user.jwt}`,
      "Content-Type": "application/json",
    },
  });
};
