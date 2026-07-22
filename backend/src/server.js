process.env.TZ = "Asia/Kolkata";

import dotenv from "dotenv";
import app from "./app.js";
import { runMigrations } from "./migrate.js";
import { startCronJobs } from "./utils/cron.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await runMigrations();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    startCronJobs();
  });
};

startServer();
