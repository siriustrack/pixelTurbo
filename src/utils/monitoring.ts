import os from "os";
import Logger from "./logger";
import clickhouseClient from "./chdb";

export const monitorSystem = () => {
  setInterval(() => {
    const usage = {
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem(),
        usagePercent: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100,
      },
      cpu: {
        loadAvg: os.loadavg(),
        uptime: os.uptime(),
      },
    };

    Logger.info("System Metrics", { metrics: usage });
  }, 300000); // Log every 5 minutes
};

export const monitorDatabase = (pool: any) => {
  setInterval(async () => {
    try {
      const client = await pool.connect();
      const startTime = Date.now();

      await client.query("SELECT 1");

      const duration = Date.now() - startTime;
      Logger.info("Database Health Check", {
        status: "healthy",
        responseTime: duration,
      });

      client.release();
    } catch (error) {
      Logger.error("Database Health Check Failed", { error });
    }
  }, 60000); // Check every minute
};

export const monitorClickhouseDatabase = () => {
  setInterval(async () => {
    try {
      const startTime = Date.now();

      // Perform a basic health check query on ClickHouse
      const response = await clickhouseClient.query({
        query: "SELECT 1",
        format: "JSON",
      });

      const result = await response.json();
      const duration = Date.now() - startTime;

      if (result) {
        Logger.info("ClickHouse Health Check", {
          status: "healthy",
          responseTime: duration,
        });
      } else {
        Logger.warn("ClickHouse Health Check", {
          status: "unresponsive",
        });
      }
    } catch (error) {
      Logger.error("ClickHouse Health Check Failed", { error });
    }
  }, 60000); // Check every minute
};
