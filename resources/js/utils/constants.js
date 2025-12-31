export const bankListOpt = [
  { value: 'bca', label: "BCA" },
  { value: 'bni', label: "BNI" },
  { value: 'mandiri', label: "Mandiri" },
  { value: 'bri', label: "BRI" },
]

export const disbursementMethodListOpt = [
  {
    value: 'MANUAL',
    label: "Transfer Manual",
    is_auto: false,
    transfer_fee: 6500,
    min_transfer: 10000,
    max_transfer: 100000000,
    description: "1-5 hari kerja oleh Admin",
  },
  {
    value: 'RTOL',
    label: "Realtime Transfer Online",
    is_auto: true,
    transfer_fee: 6500,
    min_transfer: 10000,
    max_transfer: 100000000,
    description: "Real Time",
  },
  {
    value: 'BIFAST',
    label: "BI FAST",
    is_auto: true,
    transfer_fee: 2500,
    min_transfer: 10000,
    max_transfer: 100000000,
    description: "Real Time",
  },
]
