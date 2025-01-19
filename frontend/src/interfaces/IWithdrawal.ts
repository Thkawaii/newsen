export interface WithdrawalInterface {
  id?: number; // Optional ID (can be used for tracking or database purposes)
  withdrawal_amount: number; // จำนวนเงินที่ถอน
  withdrawal_commission?: number; // ค่าคอมมิชชั่นจากการถอน
  withdrawal_net_amount?: number; // จำนวนเงินสุทธิหลังหักค่าคอมมิชชั่น
  withdrawal_bank_number?: string; // หมายเลขบัญชีธนาคาร
  withdrawal_date?: string; // วันที่ทำการถอน (ISO8601 format)
  BankNameID?: number;
  bank_name_id?: number; // ชื่อธนาคารที่ถอนเงิน
  DriverID?: number; // (เชื่อมโยงกับ Driver)
  driver_id: number;
}