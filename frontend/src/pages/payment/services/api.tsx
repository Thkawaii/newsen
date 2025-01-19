import { apiRequest } from "../../../config/ApiService";
import { Endpoint } from "../../../config/Endpoint";
import { BookingInterface } from "../interfaces/PaidInterface";

export const fetchBooking = async (
  bookingId: number
): Promise<BookingInterface> => {
  try {
    const response = await apiRequest<BookingInterface>(
      "GET",
      `${Endpoint.PAYMENT_BOOKING}/${bookingId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};
