const useStatus = (status, textColor = 'text-white') => {
  const failedStatus = ['failed', 'cancel', 'refund']
  if (!status) return ''

  let statusClass = {
    'draft': 'whitespace-pre text-white bg-gray-800',
    'publish': 'whitespace-pre text-white bg-green-600 hover:bg-green-700',
    'review': 'whitespace-pre text-white bg-primary h-auto whitespace-pre',
    'unpublish': 'whitespace-pre text-white bg-red-600 hover:bg-red-700',
    'archived': 'whitespace-pre text-white bg-red-600 hover:bg-red-700',

    "blog.draft": `whitespace-pre bg-yellow-700 px-3 border-none ${textColor}`,
    "blog.publish": `whitespace-pre bg-green-700 px-3 border-none ${textColor}`,
    "blog.archived": `whitespace-pre bg-red-600 px-3 border-none ${textColor}`,

    "empty": `whitespace-pre bg-gray-800 px-3 border-none ${textColor}`,
    "available": `whitespace-pre bg-green-600 px-3 border-none ${textColor}`,

    "nonactive": `whitespace-pre bg-gray-800 px-3 border-none ${textColor}`,
    "active": `whitespace-pre bg-green-600 px-3 border-none ${textColor}`,

    'nonactive': 'whitespace-pre text-white bg-gray-800',
    'active': 'whitespace-pre text-white bg-green-600',

    'pending': 'whitespace-pre text-white bg-gray-800',
    'success': 'whitespace-pre text-white bg-green-600',
    'processing': 'whitespace-pre text-white bg-primary',
    'waiting': 'whitespace-pre text-white bg-primary',

    "broadcast.draft": `whitespace-pre bg-yellow-700 px-3 border-none ${textColor}`,
    "broadcast.scheduled": `whitespace-pre bg-yellow-900 px-3 border-none ${textColor}`,
    "broadcast.processing": `whitespace-pre bg-purple-900 px-3 border-none ${textColor}`,
    "broadcast.sent": `whitespace-pre bg-green-600 px-3 border-none ${textColor}`,
    "broadcast.failed": `whitespace-pre bg-red-600 px-3 border-none ${textColor}`,

    "broadcast.account.pending": `whitespace-pre bg-yellow-700 px-3 border-none ${textColor}`,
    "broadcast.account.sent": `whitespace-pre bg-green-600 px-3 border-none ${textColor}`,

    "order.pending": `whitespace-pre bg-yellow-700 px-3 border-none ${textColor}`,
    "order.processing": `whitespace-pre bg-purple-900 px-3 border-none ${textColor}`,
    "order.success": `whitespace-pre bg-green-700 px-3 border-none ${textColor}`,
    "order.cancel": `whitespace-pre bg-red-600 px-3 border-none ${textColor}`,
    "order.failed": `whitespace-pre bg-red-600 px-3 border-none ${textColor}`,

    "refund.pending": `whitespace-pre bg-yellow-700 bg-opacity-70 px-3 border-none ${textColor}`,
    "refund.processing": `whitespace-pre bg-purple-900 bg-opacity-70 px-3 border-none ${textColor}`,
    "refund.success": `whitespace-pre bg-green-700 bg-opacity-70 px-3 border-none ${textColor}`,
    "refund.cancel": `whitespace-pre bg-red-600 bg-opacity-70 px-3 border-none ${textColor}`,

    "withdraw.pending": `whitespace-pre bg-yellow-700 bg-opacity-70 px-3 border-none ${textColor}`,
    "withdraw.processing": `whitespace-pre bg-purple-900 bg-opacity-70 px-3 border-none ${textColor}`,
    "withdraw.success": `whitespace-pre bg-green-700 bg-opacity-70 px-3 border-none ${textColor}`,
    "withdraw.cancel": `whitespace-pre bg-red-600 bg-opacity-70 px-3 border-none ${textColor}`,

    "bank.pending": `whitespace-pre bg-yellow-700 bg-opacity-70 px-3 border-none ${textColor}`,
    "bank.verified": `whitespace-pre bg-green-700 bg-opacity-70 px-3 border-none ${textColor}`,
    "bank.rejected": `whitespace-pre bg-red-600 bg-opacity-70 px-3 border-none ${textColor}`,

    "payment.failed": `whitespace-pre bg-yellow-700 px-3 border-none bg-opacity-70 ${textColor}`,
    "payment.success": `whitespace-pre bg-green-700 px-3 border-none bg-opacity-70 ${textColor}`,
    "payment.refund": `whitespace-pre bg-primary px-3 border-none bg-opacity-70 ${textColor}`,

    "payment.pending": `whitespace-pre bg-blue-700 px-3 border-none bg-opacity-80 ${textColor}`,
    "payment.cancel": `whitespace-pre bg-red-700 px-3 border-none bg-opacity-80 ${textColor}`,
    "payment.paid": `whitespace-pre bg-green-700 px-3 border-none bg-opacity-80 ${textColor}`,

    "contact.new": `whitespace-pre bg-yellow-700 px-3 border-none bg-opacity-80 ${textColor}`,
    "contact.process": `whitespace-pre bg-purple-900 px-3 border-none bg-opacity-80 ${textColor}`,
    "contact.finish": `whitespace-pre bg-green-700 px-3 border-none bg-opacity-80 ${textColor}`,
    "contact.cancel": `whitespace-pre bg-red-600 px-3 border-none bg-opacity-80 ${textColor}`,

    "chat.new": `whitespace-pre bg-yellow-700 px-3 border-none bg-opacity-80 ${textColor}`,
    "chat.open": `whitespace-pre bg-green-700 px-3 border-none bg-opacity-80 ${textColor}`,
    "chat.close": `whitespace-pre bg-red-600 px-3 border-none bg-opacity-80 ${textColor}`,
  }

  const badgeFiles = import.meta.glob('@/locales/badgeStyle.json', { eager: true });
  const badgeStyle = Object.values(badgeFiles)[0].default;

  statusClass = { ...statusClass, ...badgeStyle };

  if (failedStatus.includes(status)) return 'whitespace-pre text-white bg-red-600'
  return statusClass[status] ?? status;
}

export const useStatusLabel = (status) => {
  if (!status) return ''
  let label = {
    'draft': 'Draft',
    'publish': 'Diterbitkan',
    'review': 'Menunggu konfirmasi',
    'unpublish': 'Tidak diterbitkan',
    'archived': 'Diarsipkan',

    "contact.new": 'Baru',
    "contact.process": 'Diproses',
    "contact.finish": 'Selesai',
    "contact.cancel": 'Dibatalkan',

    "chat.new": 'Baru',
    "chat.open": 'Percakapan Dibuka',
    "chat.close": 'Percakapan Ditutup',

    "payment.pending": "menunggu dibayar",
    "payment.cancel": "Dibatalkan",
    "payment.paid": "sudah dibayar",

    "blog.draft": "Draft",
    "blog.publish": "Published",
    "blog.archived": "Archived",

    "active": "aktif",
    "nonactive": "nonaktif",

    "available": "Tersedia",
    "empty": "Kosong",

    "broadcast.draft": "Draft",
    "broadcast.scheduled": "Dijadwalkan",
    "broadcast.processing": "Sedang Diproses",
    "broadcast.sent": "Berhasil Dikirim",
    "broadcast.failed": "Gagal Dikirim",

    "broadcast.account.pending": "Dalam Antrian",
    "broadcast.account.sent": "Berhasil Dikirim",

    "order.pending": "butuh dibayar",
    "order.paid": "sudah dibayar",
    "order.processing": "sedang diproses",
    "request.order.success": "pengajuan selesaikan pesanan",
    "order.success": "pesanan selesai",
    "order.cancel": "pesanan dibatalkan",
    "order.failed": "pesanan dibatalkan",

    "refund.pending": "Pengembalian dana diproses",
    "refund.processing": "Pengembalian dana diproses",
    "refund.success": "Pengembalian dana selesai",
    "refund.cancel": "Pengembalian dana gagal",

    "withdraw.pending": "Menunggu Konfirmasi",
    "withdraw.processing": "Diproses",
    "withdraw.success": "Selesai",
    "withdraw.cancel": "Dibatalkan",

    "bank.pending": "Menunggu Konfirmasi",
    "bank.verified": "Terverifikasi",
    "bank.rejected": "Ditolak",

    "payment.failed": "waktu pembayaran habis",
    "payment.success": "sudah dibayar",
    "payment.paid": "sudah dibayar",
    "payment.refund": "Pembayaran dikembalikan",
  }

  const translations = import.meta.glob('@/locales/id/translations.json', { eager: true });
  const translationLabel = Object.values(translations)[0].default;

  label = { ...label, ...translationLabel };

  return label[status] ?? status;
}

export default useStatus
