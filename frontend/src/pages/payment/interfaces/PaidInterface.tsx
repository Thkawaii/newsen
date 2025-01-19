export interface BookingInterface {
    id: number;
    beginning: string;
    terminus: string;
    start_time: string;
    end_time: string;
    distance: number;
    total_price: number;
    booking_time: string;
    booking_status: string;
    vehicle: string;
    passenger_id: number;
    driver_id: number;
    start_location_id: number;
    destination_id: number;
  }
  
  export interface PromotionInterface {
    discount: number;
    end_date: string;
    id: number;
    promotion_code: string;
    promotion_description: string;
    promotion_name: string;
  }
  
  export interface PromotionResponseInterface {
    can_use: boolean;
    details: Details;
    discount_type: string;
    discount_value: number;
    message: string;
    promotion_id: number;
  }
  
  interface Details {
    id: number;
    promotion_code: string;
    promotion_name: string;
    promotion_description: string;
    discount: number;
    end_date: Date;
    use_limit: number;
    use_count: number;
    distance: number;
    distance_condition: string;
    discount_type_id: number;
  }
  