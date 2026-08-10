import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const PORT = config.port;

const main = async () => {
  try {
    await prisma.$connect();

    console.log("database Connection Success");

    app.listen(PORT, () => {
      console.log(`Server is running on Port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting th server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
