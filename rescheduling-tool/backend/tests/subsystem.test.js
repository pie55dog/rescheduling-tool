// AI NOTICE

/* 
My understanding of subsystem tests is that they should make sure the gears are all
turning, but don't have to deal with what the gears are made of (these are
unit tests). So, this file basically just tests: is the router called? 
is the controller calling ther service? 

Originally, it was testing all of these specific controller error messages. 
Maybe that was correct system testing, but I felt it would better reflect 
my knowledge to do it this way. 

*/ 

//! no system test yet for cardPositionService, since I dont know what this system should look like

import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import { handleGetAll } from "../src/controllers/allCardsController";
import { handleGetOneChange } from "../src/controllers/oneCardController";
import * as indexModule from "../src/index";

// filepath: /Users/grabish/Documents/SWE/rescheduling-tool-bigger/rescheduling-tool/backend/tests/subsystem.test.js


// Ensure we control the sheet-auth call across tests
vi.mock("../src/index", () => ({
    getAuthenticatedSheet: vi.fn(),
}));




function wrapController(originalHandler) {
    const callSpy = vi.fn();
    const wrapped = async (req, res, next) => {
        callSpy(req);
        // preserve original behavior
        return originalHandler(req, res, next);
    };
    return { callSpy, wrapped };
}

function makeAppWithWrapped({ allHandler, oneHandler } = {}) {
    const app = express();
    const result = {};

    if (allHandler) {
        const wrapped = wrapController(allHandler);
        app.get("/all", wrapped.wrapped);
        result.allControllerSpy = wrapped.callSpy;
    }

    if (oneHandler) {
        const wrapped = wrapController(oneHandler);
        app.get("/card/:index", wrapped.wrapped);
        result.oneControllerSpy = wrapped.callSpy;
    }

    result.app = app;
    return result;
}

// Additional helper to create a mock Sheets client that exposes a spy on .get
function makeMockSheetsWithGetSpy(returnValue) {
    const get = vi.fn().mockResolvedValue({ data: returnValue });
    return {
        spreadsheets: {
            values: {
                get,
            },
        },
    };
}

/* Replace the previous detailed behavior-focused tests with succinct
     stack-invocation checks. These tests focus on whether the route -> controller
     -> sheet-service chain is executed; they avoid asserting on error payloads. */
describe("Subsystem stack invocation tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("route /all invokes controller and sheet service when sheet has data", async () => {
        const sheetValues = {
            values: [
                ["Email", "Other", "Waitlisted", "Done"],
                ["a@test.com", "x", "FALSE", "FALSE"],
                ["b@test.com", "x", "TRUE", "FALSE"],
            ],
        };

        const mockSheets = makeMockSheetsWithGetSpy(sheetValues);
        const getAuthSpy = vi.spyOn(indexModule, "getAuthenticatedSheet").mockResolvedValue(mockSheets);

        const { app, allControllerSpy } = makeAppWithWrapped({ allHandler: handleGetAll });

        await request(app).get("/all").expect(200);

        // Assert the controller was invoked
        expect(allControllerSpy).toHaveBeenCalled();

        // Assert the service entry (auth) was requested and the Sheets API get was called
        expect(getAuthSpy).toHaveBeenCalled();
        expect(mockSheets.spreadsheets.values.get).toHaveBeenCalled();
    });


    it("route /card/:index invokes controller and sheet service for existing row", async () => {
        const sheetValues = { values: [["student@example.com", "Student Name"]] };
        const mockSheets = makeMockSheetsWithGetSpy(sheetValues);
        const getAuthSpy = vi.spyOn(indexModule, "getAuthenticatedSheet").mockResolvedValue(mockSheets);

        const { app, oneControllerSpy } = makeAppWithWrapped({ oneHandler: handleGetOneChange });

        await request(app).get("/card/1").expect(200);

        expect(oneControllerSpy).toHaveBeenCalled();
        expect(getAuthSpy).toHaveBeenCalled();
        expect(mockSheets.spreadsheets.values.get).toHaveBeenCalled();
    });

    it("route /card/:index throws 404 when no index is given", async () => {
        const mockSheets = makeMockSheetsWithGetSpy({ values: [] });

        const { app, oneControllerSpy } = makeAppWithWrapped({ oneHandler: handleGetOneChange });

        await request(app).get("/card").expect(404);

        
    });
});

