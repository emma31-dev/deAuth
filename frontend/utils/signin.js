import { getUserData } from "../app/api/user";
import { userAtom } from "./atom"

export default function signin() {
    const JSONObject = JSON.parse(getUserData());
    userAtom = Object.values(JSONObject);

    localStorage.setItem(JSONObject)
}