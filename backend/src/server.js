process.env.TZ = "Asia/Kolkata";

import dotenv from "dotenv";
import app from "./app.js";
import { startCronJobs } from "./utils/cron.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startCronJobs();
});
