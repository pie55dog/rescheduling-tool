// AI notice
/* 
I asked AI to write the tests (I don't really care about
knowing the syntax for vitest), but i wrote all the logic
and designed the test myself. (i do care about knowing how
to design tests)
*/

import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleGetAll } from "../src/controllers/allCardsController";
import { handleGetOneChange } from "../src/controllers/oneCardController";
import { handleUpdatePosition, formatData } from "../src/controllers/cardPositionController";
import * as allCardsService from "../src/services/allCardsService";
import * as cardService from "../src/services/cardService";
import * as cardPositionService from "../src/services/cardPositionService";
import * as indexModule from "../src/index";


// * ======================================================
// * Get all controller → should return correct error messages 
// * ======================================================



// Mock the router BEFORE any imports that use it
vi.mock("../src/routes/getAllRequestsRoute", () => ({
  default: {},
}));

// Mock the index to prevent server startup
vi.mock("../src/index", () => ({
  getAuthenticatedSheet: vi.fn(),
}));



//this is the main test for get all. it runs a 200, 404, and 500 error test. 
describe("allCardsController", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it("returns data when sheet exists", async () => { //don't need to test what comes out of the service, a separate unit test
    vi.spyOn(indexModule, "getAuthenticatedSheet").mockResolvedValue({});
    
    const mockData = { Done: [], Waitlist: [], To_Do: [], AllCards: [] };
    vi.spyOn(allCardsService, "getSheetData").mockResolvedValue(mockData);

    await handleGetAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("returns 404 when sheet data is empty", async () => {
    vi.spyOn(indexModule, "getAuthenticatedSheet").mockResolvedValue({});
    vi.spyOn(allCardsService, "getSheetData").mockResolvedValue(null);

    await handleGetAll(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Sheet not found", 
      message: "The requested sheet does not exist"
    });
  });

  it("returns 500 when service throws", async () => {
    vi.spyOn(indexModule, "getAuthenticatedSheet").mockResolvedValue({});
    vi.spyOn(allCardsService, "getSheetData").mockRejectedValue(new Error("API failure"));

    await handleGetAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error 500", 
        message: "Failed to get and format sheet" 
    });
  });
});

// * ======================================================
// * Get one card controller → should return correct error messages 
// * ======================================================

describe("oneCardController", () => {
  let req;
  let res;

  beforeEach(() => {
    req = { params: { index: 27 } }    
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it("returns data when sheet exists", async () => { //don't need to test what comes out of the service, a separate unit test
    vi.spyOn(indexModule, "getAuthenticatedSheet").mockResolvedValue({});
    
    const mockData = { grade: "12", type: "name" };
    vi.spyOn(cardService, "getSheetData").mockResolvedValue(mockData);

    await handleGetOneChange(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("returns 404 when sheet data is empty", async () => {
    vi.spyOn(indexModule, "getAuthenticatedSheet").mockResolvedValue({});
    vi.spyOn(cardService, "getSheetData").mockResolvedValue(null);

    await handleGetOneChange(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Card not found", 
      message: "The requested card does not exist in the database"
    });
  });

  it("returns 500 when service throws", async () => {
    vi.spyOn(indexModule, "getAuthenticatedSheet").mockResolvedValue({});
    vi.spyOn(cardService, "getSheetData").mockRejectedValue(new Error("API failure"));

    await handleGetOneChange(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error 500", 
      message: "Failed to retrieve card"
    });
  });
});

// * ======================================================
// *  Card position controller → should return correct error messages 
// * ======================================================
//! THESE TESTS SHOULD BE FAILING RIGHT NOW! FEATURE NOT DONE


describe("cardPositionController", () => {
  let req;
  let res;

  beforeEach(() => {
    req = { params: { indexes: "21+91-102+88", cells: "WF+WD+FD"} } 
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  const sheetConstants = {
  ISWAITLISTED_COL: "G",
  ISDONE_COL: "H"
};

  (global).sheetConstants = sheetConstants;

  //formats data
  describe("formatData", () => {
    it("correctly formats sheetIndexes and allValuesFormatted", () => {
      // Arrange
      const req = {
        params: {
          indexes: "1+6-7+5",
          newPositions: "WF+FD+FF"
        }
      };

      // Act
      const { sheetIndexes, allUpdateValuesFormated } = formatData(req);

      // Assert sheet index formatting
      expect(sheetIndexes).toEqual([
        "G1:H1",
        "G6:H6",
        "G5:H5"
      ]);

      // Assert converted values ("W" → TRUE, "F" → FALSE, "D" → TRUE)
      expect(allUpdateValuesFormated).toEqual([
        ["TRUE", "FALSE"],  // "WF"
        ["FALSE", "TRUE"],  // "FD"
        ["FALSE", "FALSE"]    // "FF"
      ]);
    });
  });

  it("returns data when sheet exists", async () => { //don't need to test what comes out of the service, a separate unit test
    vi.spyOn(indexModule, "getAuthenticatedSheet").mockResolvedValue({});
    
    const mockData = { data: {}, status: 200, statusTest: "OK", headers: {}, config: {}, request: {} };
    vi.spyOn(cardPositionService, "putCardPosition").mockResolvedValue(mockData);

    await handleUpdatePosition(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("returns 404 when sheet data is empty", async () => {
    vi.spyOn(indexModule, "getAuthenticatedSheet").mockResolvedValue({});
    vi.spyOn(cardPositionService, "putCardPosition").mockResolvedValue(null);

    await handleUpdatePosition(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Card not found", 
      message: "The requested card does not exist in the database"
    });
  });

  it("returns 500 when service throws", async () => {
    vi.spyOn(indexModule, "getAuthenticatedSheet").mockResolvedValue({});
    vi.spyOn(cardPositionService, "putCardPosition").mockRejectedValue(new Error("API failure"));

    await handleUpdatePosition(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error 500", 
      message: "Failed to retrieve card"
    });
  });
});

