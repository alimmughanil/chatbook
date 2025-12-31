import { useMemo } from "react"
import { router, usePage } from "@inertiajs/react"
import { MessageCircle, Link as LinkIcon, ShieldCheck } from "lucide-react"
import {
  FacebookShareButton, FacebookIcon,
  WhatsappShareButton, WhatsappIcon,
  LinkedinShareButton, LinkedinIcon,
  TwitterShareButton, XIcon,
} from "react-share"

import { whatsappNumber, currency } from "@/utils/format"
import { toast } from "react-toastify"
import { useAtom } from "jotai"
import { activePackageAtom } from "@/atoms"

export const ShareBtn = ({ product }) => {
  const { props } = usePage()
  const url = props.location

  return (
    <div className="flex items-center justify-center gap-2 mb-3">
      <WhatsappShareButton url={url} title={product?.name} separator=":: ">
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      <FacebookShareButton url={url}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <LinkedinShareButton url={url}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <TwitterShareButton url={url} title={product?.name}>
        <XIcon size={32} round />
      </TwitterShareButton>

      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(url)
          toast("Link produk telah disalin", { type: "success" })
        }}
        className="border border-gray-300 rounded-full h-[32px] w-[32px] flex items-center justify-center hover:bg-gray-50"
        title="Copy Link"
      >
        <LinkIcon size={16} className="text-gray-600" />
      </button>
    </div>
  )
}

export const ProductActionCard = ({
  product,
  whatsappUrl,      // optional: kalau sudah dikasih dari parent
  assignedUser,     // optional: untuk UI card freelancer
  isShowNego = false,
  packages: packagesProp, // optional: kalau tidak mau ambil dari product
}) => {
  const packages = packagesProp ?? product?.packages ?? []
  const [activeIdx, setActiveIdx] = useAtom(activePackageAtom)

  const URL_DEFAULT_PHOTO = "/image/user.png"
  const isAvailable = product?.status === "publish"
  const productName = product?.name ?? ""

  // ===== WA prompt (ambil dari UI DetailProductPrice) =====
  const waPrompt = useMemo(() => {
    if (whatsappUrl) return whatsappUrl

    const targetPhone = assignedUser?.phone
    if (!targetPhone) return null
    const cleanPhone = whatsappNumber(targetPhone)

    const message = !isShowNego
      ? `Halo admin, saya ingin memesan ${productName} Paket ${packages?.[activeIdx]?.name} ini`
      : `Halo admin, saya ingin meminta penawaran harga untuk Produk ${productName} ini`

    if (!cleanPhone) return "#"
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
  }, [whatsappUrl, assignedUser?.phone, isShowNego, productName, packages, activeIdx])

  // ===== Link create order (sesuai request) =====
  const orderHref = useMemo(() => {
    const p = packages?.[activeIdx]
    const productId = p?.product_id ?? product?.id ?? ""
    const detailId = p?.id ?? ""
    return `/app/order/create?product_id=${encodeURIComponent(productId)}&product_detail_id=${encodeURIComponent(detailId)}`
  }, [packages, activeIdx, product?.id])

  const handleRedirectRegistration = () => {
    return router.get(`/product/${product.slug}/registration`)
  }

  // ===== Mode Nego (tanpa harga pasti) =====
  if (isShowNego) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-200/50 overflow-hidden sticky top-24">
        <div className="p-6">
          {!!waPrompt ? (
            <a
              target="_blank"
              href={waPrompt}
              rel="noreferrer"
              className="w-full transition-all flex items-center justify-center bg-[#6017BE] text-white hover:bg-[#4c1296] p-3 my-3 rounded-lg font-semibold shadow-purple-200 shadow-lg"
            >
              <MessageCircle size={18} className="mr-2" />
              Tanyakan Produk Ini
            </a>
          ) : null}

          <div className="my-4 border-t border-gray-100 pt-4">
            <ShareBtn product={product} />
          </div>

          <p className="text-center text-gray-400 text-xs px-3">
            Hubungi kami untuk penawaran harga
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-1">
              <ShieldCheck size={14} />
              <span>Garansi Uang Kembali</span>
            </div>
            <p className="text-[10px] text-gray-400">
              Pembayaran aman, dana diteruskan setelah pekerjaan selesai.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ===== Mode Normal (paket + harga) =====
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-200/50 overflow-hidden sticky top-24">
      <div className="p-6">
        {/* Card assigned user (ambil dari DetailProductPrice) */}
        {assignedUser && (
          <div className="border shadow-sm rounded-xl border-gray-100 bg-white mb-6 p-4 flex items-center gap-4">
            <div className="w-[60px] h-[60px] rounded-full relative overflow-hidden flex-shrink-0 border border-gray-100">
              <img
                className="w-full h-full object-cover"
                src={
                  assignedUser.picture
                    ? `https://backoffice.proyekin.id${assignedUser.picture}`
                    : URL_DEFAULT_PHOTO
                }
                alt={assignedUser.name}
              />
            </div>
            <div>
              <p className="capitalize font-bold text-gray-900">{assignedUser.name}</p>
              <p className="text-sm text-gray-500 line-clamp-1">
                {assignedUser.short_bio || "Freelancer"}
              </p>
            </div>
          </div>
        )}

        {/* Tabs paket (UI DetailProductPrice) */}
        {packages?.length > 0 ? (
          <>
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 -mx-6 mb-4">
              {packages.map((el, idx) => (
                <button
                  key={el?.id ?? idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors whitespace-nowrap
                    ${idx === activeIdx
                      ? "bg-white text-[#6017BE] border-b-2 border-[#6017BE]"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  {currency(el.price)}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <p className="text-gray-900 font-bold text-lg mb-1">
                Paket {packages[activeIdx]?.name}
              </p>
              <p className="text-[#6017BE] font-bold text-2xl">
                {currency(packages[activeIdx]?.price)}
              </p>
            </div>

            <div className="prose prose-sm text-gray-600 mb-6 max-h-40 overflow-y-auto custom-scrollbar">
              <div
                dangerouslySetInnerHTML={{ __html: packages[activeIdx]?.description ?? "" }}
              />
            </div>

            {/* Pesan (langsung href create order) */}
            <a
              href={isAvailable ? orderHref : "#"}
              className={`w-full block text-center font-bold py-3 rounded-lg shadow-lg shadow-purple-200 transition-all mb-3
                ${isAvailable ? "bg-[#6017BE] hover:bg-[#4c1296] text-white" : "bg-gray-300 text-white pointer-events-none"}`}
            >
              {isAvailable ? "Pesan Paket Ini" : "Tidak Tersedia"}
            </a>
          </>
        ) : (
          <>
            {/* Fallback kalau tidak ada packages: pakai UI ActionCard lama */}
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Mulai dari
              </span>
            </div>
            <h3 className="text-3xl font-bold text-[#6017BE] mb-6">
              {product.price === 0 ? "Gratis" : currency(product.price)}
            </h3>

            <button
              type="button"
              disabled={!isAvailable}
              onClick={handleRedirectRegistration}
              className="w-full bg-[#6017BE] hover:bg-[#4c1296] disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-200 active:scale-[0.98] mb-3"
            >
              {isAvailable ? "Pesan Jasa Sekarang" : "Tidak Tersedia"}
            </button>
          </>
        )}

        {/* Tanyakan via WA (UI DetailProductPrice) */}
        {!!waPrompt ? (
          <a
            target="_blank"
            href={waPrompt}
            rel="noreferrer"
            className="w-full flex items-center justify-center text-[#6017BE] bg-purple-50 hover:bg-purple-100 border border-purple-100 p-3 mb-6 rounded-lg font-semibold transition-all"
          >
            <MessageCircle size={18} className="mr-2" />
            Tanyakan Produk Ini
          </a>
        ) : null}

        {/* Share buttons */}
        <div className="border-t border-gray-100 pt-4">
          <ShareBtn productName={productName} />
        </div>

        {/* Footer garansi (UI ActionCard lama) */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-1">
            <ShieldCheck size={14} />
            <span>Garansi Uang Kembali</span>
          </div>
          <p className="text-[10px] text-gray-400">
            Pembayaran aman, dana diteruskan setelah pekerjaan selesai.
          </p>
        </div>
      </div>
    </div>
  )
}
