import moment from "moment";

const INTERVAL = 1000 * 3600;
export default function startTrafficReport() {
  setInterval(() => {
    const date = moment().format("YYYY/MM/DD HH:mm");
    console.log(`[${date}]: sending traffic report`);
  }, INTERVAL);
}
