import express from "express";

class ApiHelper {

    /**
     * Sends a fail response back to the requester.
     */
    sendErrorResponse(res: express.Response, error: string) {
        this.sendResponse(res, false, error, undefined);
    }

    /**
     * Sends a success response back to the requester.
     */
    sendSuccessResponse(res: express.Response, data?: any) {
        this.sendResponse(res, true, undefined, data);
    }

    /**
     * Sends a response back to the requester with a standard format.
     */
    sendResponse(res: express.Response, isSuccess: boolean, error?: string, data?: any) {
        res.json({
            isSuccess,
            error,
            data
        });
    }
}
export default new ApiHelper();