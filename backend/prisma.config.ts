import { defineConfig, env } from "prisma/config";
import "dotenv/config"; // 환경 변수 로드 보장

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});