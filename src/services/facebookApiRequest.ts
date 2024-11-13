import axios from "axios";
import { ServerEvent, Event } from "../types";
import EventModel from "../models/event";

class FacebookApiRequestService {
  private async sendToFacebookApi(
    pixelId: string,
    accessToken: string,
    events: ServerEvent[],
    testEventCode?: string
  ) {
    const url = `https://graph.facebook.com/v20.0/${pixelId}/events`;

    const data = {
      data: events,
      ...(testEventCode && { test_event_code: testEventCode }),
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await axios.post(url, data, config);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error sending to Facebook API:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async processAndSendEvent(
    event: Event,
    pixelId: string,
    accessToken: string,
    testEventCode?: string
  ): Promise<Event> {
    // Convert your event to Facebook ServerEvent format
    const serverEvent: ServerEvent = {
      event_name: event.event_name,
      event_time: Math.floor(event.event_time.getTime() / 1000),
      event_source_url: event.event_url || undefined,
      event_id: event.event_id,
      action_source: "website",
      user_data: {
        client_ip_address: event.geo_ip || undefined,
        client_user_agent: event.geo_device || undefined,
        em: event.lead_id ? ["HASHED_EMAIL"] : undefined, // You should implement proper hashing
        ph: event.lead_id ? ["HASHED_PHONE"] : undefined, // You should implement proper hashing
        fbc: event.fbc || undefined,
        fbp: event.fbp || undefined,
        external_id: event.lead_id || undefined,
        ct: event.geo_city || undefined,
        st: event.geo_state || undefined,
        zp: event.geo_zipcode || undefined,
        country: event.geo_country || undefined,
      },
      custom_data: {
        value: event.value || undefined,
        currency: event.currency || undefined,
        content_name: event.content_name || undefined,
        content_ids: event.content_ids ? [event.content_ids] : undefined,
        predicted_ltv: event.predicted_ltv || undefined,
      },
    };

    try {
      // Store the request payload
      const updatedEvent = {
        ...event,
        facebook_request: JSON.stringify({
          data: [serverEvent],
          ...(testEventCode && { test_event_code: testEventCode }),
        }),
      };

      // Send to Facebook
      const facebookResponse = await this.sendToFacebookApi(
        pixelId,
        accessToken,
        [serverEvent],
        testEventCode
      );

      // Update with the response
      updatedEvent.facebook_response = JSON.stringify(facebookResponse);

      // Save to database using update or create based on ID existence
      const savedEvent = updatedEvent.id
        ? await EventModel.update(updatedEvent)
        : await EventModel.create(updatedEvent);

      return savedEvent;
    } catch (error: any) {
      // Still save the event with error response
      const updatedEvent = {
        ...event,
        facebook_request: JSON.stringify({
          data: [serverEvent],
          ...(testEventCode && { test_event_code: testEventCode }),
        }),
        facebook_response: JSON.stringify({
          error: error.response?.data || error.message,
        }),
      };

      // Save to database using update or create based on ID existence
      const savedEvent = updatedEvent.id
        ? await EventModel.update(updatedEvent)
        : await EventModel.create(updatedEvent);

      throw error;
    }
  }
}

export default new FacebookApiRequestService();
