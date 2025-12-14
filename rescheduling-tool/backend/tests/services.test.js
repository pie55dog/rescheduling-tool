// AI notice
/* 
I asked AI to write the tests (I don't really care about
knowing the syntax for vitest), but i wrote all the logic
and designed the test myself. (i do care about knowing how
to design tests)
*/


import { describe, it, expect, vi } from "vitest";
import { getSheetData } from "../src/services/allCardsService"; 
import * as getCardData from "../src/services/cardService"; //imported as * since it has the same name as allCardsService
import {putCardPosition} from "../src/services/cardPositionService";


// Mock constants used inside the module
vi.mock("../src/SHEET_CONSTANTS", () => ({
  default: { SHEET_ID: "TEST_SHEET_ID" },
}));

describe("allCardService", () => {

  it("groups cards by email and sorts by done / waitlist status", async () => {

    // mock sheet response
    const mockResponse = {
      data: {
        values: [
          ["Email", "Other", "Waitlisted", "Done"], // header row
          ["a@test.com", "x", "FALSE", "FALSE"],   // To_Do
          ["b@test.com", "x", "TRUE", "FALSE"],    // Waitlist
          ["c@test.com", "x", "FALSE", "TRUE"],    // Done
          ["a@test.com", "y", "FALSE", "FALSE"],   // Same student as row 1 → should merge into existing card
        ],
      },
    };

    const mockSheets = {
      spreadsheets: {
        values: {
          get: vi.fn().mockResolvedValue(mockResponse),
        },
      },
    };

    const result = await getSheetData(mockSheets, "Sheet1!A1:D5");

    expect(result).toBeDefined();
    expect(result.AllCards.length).toBe(3);

    const cardA = result.AllCards.find(c => c.studentEmail === "a@test.com");
    expect(cardA.index).toEqual([1, 4]);  // merged
    expect(cardA.isDone).toBe(false);
    expect(cardA.isWaitlisted).toBe(false);

    const cardB = result.AllCards.find(c => c.studentEmail === "b@test.com");
    expect(cardB.isWaitlisted).toBe(true);

    const cardC = result.AllCards.find(c => c.studentEmail === "c@test.com");
    expect(cardC.isDone).toBe(true);

    // Sorting checks
    expect(result.To_Do.length).toBe(1);
    expect(result.Waitlist.length).toBe(1);
    expect(result.Done.length).toBe(1);

    expect(result.Done[0].studentEmail).toBe("c@test.com");
    expect(result.Waitlist[0].studentEmail).toBe("b@test.com");
    expect(result.To_Do[0].studentEmail).toBe("a@test.com");
  });

  it("handles empty sheets safely", async () => {
    const mockSheets = {
      spreadsheets: {
        values: {
          get: vi.fn().mockResolvedValue({ data: { values: [] } }),
        },
      },
    };

    const result = await getSheetData(mockSheets, "Sheet1!A1:D1");
    expect(result).toEqual([]); 
  });

});


// ******************************
// * cardService
// ******************************

// Helper to mock the Sheets API client
function mockSheets(returnValue){
  return {
    spreadsheets: {
      values: {
        get: vi.fn().mockResolvedValue({
          data: returnValue
        })
      }
    }
  }
}

describe("cardService", () => {

  it("maps spreadsheet rows correctly into { email, name } objects", async () => {
    const sheets = mockSheets({
      values: [
        ["test@example.com", "Alice"],
        ["bob@example.com", "Bob"]
      ]
    });

    const result = await getCardData.getSheetData(sheets, "Sheet1!A:B");

    expect(result).toEqual([
      { email: "test@example.com", name: "Alice" },
      { email: "bob@example.com", name: "Bob" }
    ]);
  });

  it("handles null or missing values by converting them to empty strings", async () => {
    const sheets = mockSheets({
      values: [
        [null, "Alice"],
        ["bob@example.com", undefined],
        []
      ]
    });

    const result = await getCardData.getSheetData(sheets, "Sheet1!A:B");

    expect(result).toEqual([
      { email: "", name: "Alice" },
      { email: "bob@example.com", name: "" },
      { email: "", name: "" }
    ]);
  });

  it("returns an empty array when sheet has no rows", async () => {
    const sheets = mockSheets({ values: [] });

    const result = await getCardData.getSheetData(sheets, "Sheet1!A:B");

    expect(result).toEqual([]);
  });

  it("returns an empty array when `values` is undefined (null error case)", async () => {
    const sheets = mockSheets({});

    const result = await getCardData.getSheetData(sheets, "Sheet1!A:B");

    expect(result).toEqual([]);
  });

});

// ***********
// * putCardPosition
// ****************
//! SHOULD BE FAILING RIGHT NOW! NOT FINISHED FEATURE
    // writing this test so next programmer knows what should make it pass here

describe("putCardPosition Service", () => {
  it("calls batchUpdate with correct parameters and returns result", async () => {
    const sheets = mockSheets();

    const mockRequestBody = {
      valueInputOption: "USER_ENTERED",
      data: [
        {
          range: "W10:F10",
          values: [["TRUE", "FALSE"]]
        }
      ]
    };

    const result = await putCardPosition(sheets, mockRequestBody);

    expect(sheets.spreadsheets.values.batchUpdate).toHaveBeenCalledWith({
      spreadsheetId: sheetConstants.SHEET_ID,
      requestBody: mockRequestBody
    });

    expect(result).toEqual({
      status: 200,
      data: { totalUpdatedCells: 4 }
    });
  });
});
