import { usePage } from "@inertiajs/react"
import { useStatusLabel } from "./useStatus"
import { jsonParse } from "./format"

const configurationLang = {
  UNDER_CONSTRUCTION: "Sedang Dalam Perbaikan",
  TELEGRAM_GROUP: "Link Grup Telegram",

  FEE_PLATFORM: 'Biaya Platform (Rp)',
  FEE_TRANSFER_BANK: 'Biaya Transfer Bank (Rp)',

  WHATSAPP_NUMBER: 'Nomor WhatsApp',
  EMAIL: 'Email',
  ADDRESS: 'Alamat',
  CONTENT_HOME: 'Konten Home',
  CONTENT_ABOUT: 'Konten About',
  CONTENT_PRIVACY_POLICY: 'Konten Kebijakan Privasi',
  CONTENT_DISCLAIMER: 'Konten Disclaimer',
  CONTENT_FAQ: 'Konten FAQ',

  CONTENT_TERM_CONDITION: 'Konten Syarat dan Ketentuan',
  FEATURED_MAX_ROW: 'Featured Product Max Row',
  WORK_SUBMIT_TTL: 'TTL Submit Pekerjaan (Hari)',
  DISBURSEMENT_REQUEST: 'Disbursement Request',
  PRODUCT_REQUEST: 'New Product Approval',
  TAGLINE: 'Tagline',
}

const langs = {
  ...configurationLang,
  Admin: "Admin",
  show: "Tampilkan",
  hidden: "Sembunyikan",
  "lang.id": "Indonesia",
  "lang.en": "Inggris",

  "category.product": "Produk",
  "category.article": "Artikel",

  "banner.image": "Gambar",
  "banner.video": "Video",

  "profile.companyName": "Nama Aplikasi",
  "profile.about": "Tentang Aplikasi",
  "profile.tagline": "Tagline",
  "profile.email": "Email",
  "profile.phone": "Telepon",
  "profile.whatsapp": "Whatsapp",
  "profile.facebook": "Facebook",
  "profile.instagram": "Instagram",
  "profile.youtube": "Youtube",
  "profile.officeAddress": "Address",
  "profile.addressMap": "Address Map",
  "profile.location": "Lokasi Aplikasi",

  "seo.default": "Default",

  "male": "Pria",
  "female": "Wanita",
  "other": "Lainnya"
}
function useLang(string, pageProps = null) {
  if (!string) return ''

  let translation = getTranslation(pageProps)
  const translations = { ...translation, ...langs }
  return translations[string] ?? useStatusLabel(string) ?? string
}

const getTranslation = (props) => {
  if (!props) {
    props = usePage().props
  }
  const { lang_translation, lang } = props
  let contents = jsonParse(lang_translation?.content)

  if (!contents) {
    contents = {}
  }

  const defaultLang = "id"

  let jsonContent = {}
  const allTranslations = import.meta.glob("@/locales/**/*.json", { eager: true })
  let matchPath = Object.keys(allTranslations).find((path) => path.includes(`/${lang}/`))

  if (!matchPath) {
    matchPath = Object.keys(allTranslations).find((path) => path.includes(`/${defaultLang}/`))
  }

  if (matchPath) {
    jsonContent = allTranslations[matchPath].default
  }

  contents = { ...jsonContent, ...contents }
  return contents
}

export default useLang
