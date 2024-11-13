import { Request, Response } from "express";
import FacebookApiRequestService from "../services/facebookApiRequest";
import { Event } from "../types";

class FacebookApiRequestController {
  async sendEvent(req: Request, res: Response): Promise<void> {
    try {
      const event: Event = req.body.event;
      const pixelId: string = req.body.pixel_id;
      const accessToken: string = req.body.access_token;
      const testEventCode: string | undefined = req.body.test_event_code;

      if (!event || !pixelId || !accessToken) {
        return res.status(400).json({
          error:
            "Missing required parameters: event, pixel_id, and access_token are required",
        });
      }

      const result = await FacebookApiRequestService.processAndSendEvent(
        event,
        pixelId,
        accessToken,
        testEventCode
      );

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in sendEvent controller:", error);
      return res.status(500).json({
        error: "Error processing Facebook API request",
        details: error.response?.data || error.message,
      });
    }
  }
}

export default new FacebookApiRequestController();
