import ReactDOM from "react-dom/client";
import App from "./App";
import "./globals.css";
import { invoke } from "@tauri-apps/api";

invoke("init");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
