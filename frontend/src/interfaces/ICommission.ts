export interface CommissionInterface {
	id?: number;
	commission_amount: number;
	commission_total: number; // จำนวนคอมมิชชั่นรวม (หัก 30)
	commission_date: string; // วันที่คอมมิชชั่น (ISO8601 format)
  
	WithdrawalID: string; 
  }
  