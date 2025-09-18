// backend/src/googleSheetsRunner.ts
import { listMajors } from "./src/services/googleSheets";

async function main(): Promise<void> {
  try {
    await listMajors();
  } catch (err:any) {
    if (err instanceof Error) {
      console.error("Error running sample:", err.message);
    } else {
      console.error("Unknown error:", err);
    }
  }
}

main();
