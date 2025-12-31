import React, { useMemo, useState } from "react"
import { router } from "@inertiajs/react"
import { MessageCircle } from "lucide-react"
import { currency, whatsappNumber } from "@/utils/format"
import { useAtom } from "jotai"
import { activePackageAtom } from "@/atoms"

const ProductActionMobileCard = ({
  product,
  packages: packagesProp,
  user,
  whatsappUrl,
  isShowNego = false,
}) => {
  const packages = packagesProp ?? product?.packages ?? []
  const [activeIdx, setActiveIdx] = useAtom(activePackageAtom)

  const activePackage = packages?.[activeIdx]
  const isAvailable = product?.status === "publish"

  const priceText = useMemo(() => {
    if (isShowNego) return "Harga Nego"
    if (activePackage) return currency(activePackage.price)
    return product?.price === 0 ? "Gratis" : currency(product?.price ?? 0)
  }, [isShowNego, activePackage, product?.price])

  const orderHref = useMemo(() => {
    const productId = activePackage?.product_id ?? product?.id
    let orderUrl = `/app/order/create?product_id=${encodeURIComponent(productId)}`

    if (activePackage?.id && (activePackage?.product_id ?? product?.id)) {
      return `${orderUrl}&product_detail_id=${encodeURIComponent(activePackage.id)}`
    }
    return orderUrl
  }, [activePackage, product?.id, product?.slug])

  // ===== WhatsApp prompt =====
  const waPrompt = useMemo(() => {
    if (whatsappUrl) return whatsappUrl

    const phoneRaw = user?.phone
    if (!phoneRaw) return null

    const phone = whatsappNumber(phoneRaw)
    const message = !isShowNego
      ? `Halo admin, saya ingin memesan ${product?.name ?? ""} Paket ${activePackage?.name ?? ""} ini`
      : `Halo admin, saya ingin meminta penawaran harga untuk Produk ${product?.name ?? ""} ini`

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }, [whatsappUrl, user?.phone, isShowNego, product?.name, activePackage?.name])

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {/* ===== Tabs Paket + Info paket aktif (sesuai style yang kamu minta) ===== */}
      {packages?.length > 0 ? (
        <>
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
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
        </>
      ) : null}

      {/* ===== Main bottom actions ===== */}
      <div className="px-4 pb-4 flex items-center justify-between gap-3 mt-2">
        {!!packages[activeIdx] ? (
          <div className="flex flex-col">
            <span className="text-gray-900 font-bold text-sm mb-0.5">
              Paket {packages[activeIdx]?.name}
            </span>
            <span className="font-bold text-lg text-[#6017BE]">
              {currency(packages[activeIdx]?.price)}
            </span>
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="text-gray-900 font-bold text-sm mb-0.5">
              {isShowNego ? "Penawaran" : "Total Harga"}
            </span>
            <span className="font-bold text-lg text-[#6017BE]">{priceText}</span>
          </div>
        )}

        <div className="flex gap-2">
          {!!waPrompt && waPrompt !== "#" ? (
            <a
              href={waPrompt}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center px-3 py-2 rounded-lg border border-gray-200 text-[#6017BE] bg-white hover:bg-gray-50"
              title="Tanyakan via WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
          ) : null}

          {isShowNego ? (
            <a
              href={waPrompt}
              target="_blank"
              rel="noreferrer"
              className="bg-[#6017BE] text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md shadow-purple-200"
            >
              Tanya Harga
            </a>
          ) : packages?.length > 0 ? (
            <a
              href={isAvailable ? orderHref : "#"}
              className={`px-5 py-2.5 rounded-lg font-bold text-sm shadow-md shadow-purple-200
                ${isAvailable
                  ? "bg-[#6017BE] text-white"
                  : "bg-gray-300 text-white pointer-events-none"
                }`}
            >
              {isAvailable ? "Pesan Paket Ini" : "Tidak Tersedia"}
            </a>
          ) : (
            <button
              type="button"
              disabled={!isAvailable}
              onClick={() => router.get(`/product/${product?.slug}/registration`)}
              className="bg-[#6017BE] hover:bg-[#4c1296] disabled:bg-gray-300 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md shadow-purple-200"
            >
              {isAvailable ? "Pesan Jasa" : "Tidak Tersedia"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductActionMobileCard
