import useStatus, { useStatusLabel } from '@/utlis/useStatus';
import { Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react'
import RowLabel from '../RowLabel';
import { currency, dateFormat, isFunction, isNumber } from '@/utlis/format';
import useLang from '@/utlis/useLang';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { ModalButton } from '../WithModal';
import { showModalAtom } from '@/atoms';
import { useAtom } from 'jotai';

function DetailModalItem({ data, tableHeader, rowPropsBase = null, className = null }) {
  const { props } = usePage()
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [show, setShow] = useAtom(showModalAtom)

  if (!rowPropsBase) {
    rowPropsBase = { wrapperClassName: 'flex flew-row flex-wrap justify-between', labelClassName: "flex-1 font-medium text-sm md:text-base", valueClassName: "text-sm md:text-base", emptyCheck: false }
  }

  return (
    <div className={`${className ?? "flex flex-col w-full max-h-[60vh] overflow-auto"}`}>
      {tableHeader.map((header, i) => {
        if (header?.customHeader && typeof header?.customHeader === "function") {
          header = header?.customHeader({ data, header })
        }

        if ('isDetail' in (header || {}) && header.isDetail === false) return null;
        if ('isHidden' in (header || {}) && header.isHidden === true) return null;

        let isModalDetail = false
        if ("isModalDetail" in (header || {}) && header.isModalDetail === true) {
          isModalDetail = true
        }

        let actionUrl = null
        if (header?.actionUrl && typeof header?.actionUrl === "function") {
          actionUrl = header?.actionUrl({ data })
        }

        let rowProps = { ...rowPropsBase }
        for (const key of Object.keys(rowProps)) {
          if (key in (header || {})) {
            rowProps[key] = header[key]
          }
        }

        let headerValue = header?.value?.split('.')
        let value = headerValue?.reduce((acc, key) => acc?.[key], data)

        if ('isHidden' in (header || {}) && header.isHidden === 'not null' && !value) return null;
        if ('emptyCheck' in (header || {})) {
          rowProps.emptyCheck = header?.emptyCheck
        };

        if (!value) {
          value = ''
        }


        if (!!header?.code) {
          let codeValue = header?.code.split('.')
          let code = codeValue.reduce((acc, key) => acc?.[key], data)
          if (code) {
            value = `${code} - ${value}`
          }
        }

        if (!!header?.prefix && header?.type != 'status') {
          let prefix = header?.prefix
          if (!prefix.endsWith(".")) {
            prefix += "."
          }

          value = `${prefix ?? ""}${value}`
        }

        if (!!header?.valueLabel && !!value) {
          if (isFunction(header?.valueLabel)) {
            value = header?.valueLabel({data, value})
          } else{
            value = header?.valueLabel.toString().replaceAll("[value]", value)
          }
        }

        if (!value && !!header?.defaultValue) {
          value = header?.defaultValue
        }

        let typeCase = 'normal'
        if ("typeCase" in (header || {}) && header.typeCase) {
          typeCase = header.typeCase
        }

        if (typeCase == 'lowerCase') {
          value = value?.toLowerCase()
        }

        if (header.type == 'boolean') {
          value = !!value ? "Ya" : "Tidak"
        }

        if (header?.custom && typeof header?.custom === 'function' && header?.isDefaultLabel) {
          rowProps.wrapperClassName = "flex flex-col"
          return (
            <RowLabel label={header.label} {...rowProps}>
              {header?.custom({ data, key: i, header, defaultClassName: rowProps })}
            </RowLabel>
          )
        }

        if (header?.custom && typeof header?.custom === 'function') {
          return header?.custom({ data, key: i, header, defaultClassName: rowProps })
        }

        if (header.type == 'numbering') return null
        if (header.type == 'action') return null

        if (header.type == 'gallery') {
          const images = value?.map((image) => ({
            original: image?.value,
            thumbnail: image?.value,
            originalClass: `w-full p-4 object-cover ${isFullScreen ? '' : 'max-w-[300px] max-h-[300px]'}`
          }))

          const galleryOptions = {
            showThumbnails: false,
            showBullets: true,
            showFullscreenButton: true,
            showPlayButton: false,
            onScreenChange: (fullscreen) => setIsFullScreen(fullscreen)
          }

          return (
            <div key={i}>
              <RowLabel label={header.label} {...rowProps}>
                {images.length > 0 ? <ImageGallery items={images} {...galleryOptions} /> : '-'}
              </RowLabel>
            </div>
          )
        }
        if (header.type == 'image') {
          rowProps.wrapperClassName = "flex flex-col"

          return (
            <div key={i}>
              <RowLabel label={header.label} {...rowProps}>
                {value ? (
                  <img src={value} alt={header.label} className={`w-full max-w-[12rem] object-cover ${header?.className}`} />
                ) : header?.defaultValue ?? "-"}
              </RowLabel>
            </div>
          )
        }
        if (header.type == 'video') {
          rowProps.wrapperClassName = "flex flex-col"

          return (
            <div key={i}>
              <RowLabel label={header.label} {...rowProps}>
                <video src={value} alt={header.label} className={`w-full max-w-[12rem] object-cover ${header?.className}`} />
              </RowLabel>
            </div>
          )
        }

        if (header.type == 'html') {
          rowProps.wrapperClassName = "flex flex-col"

          return (
            <div key={i}>
              <RowLabel label={header.label} {...rowProps}>
                <div className={`text-editor-content ${header?.className}`} dangerouslySetInnerHTML={{ __html: value }}></div>
              </RowLabel>
            </div>
          )
        }

        if (header.type == 'status_message') {
          rowProps.wrapperClassName = "flex flex-col"

          if (!data?.status_message) return null
          const statusHeader = tableHeader.find(header => header.type === 'status')

          return (
            <div key={i}>
              <RowLabel label={`Alasan ${useLang(`${statusHeader?.prefix ?? ''}${data?.status}`)}`} {...rowProps} >
                {data?.status_message}
              </RowLabel>
            </div>
          )
        }

        if (header.type == 'status') {
          let prefix = header.prefix ?? ""
          if (prefix && !prefix?.endsWith(".")) {
            prefix += "."
          }

          rowProps.valueClassName += " pb-1"

          return (
            <div key={i}>
              <RowLabel label={header.label} {...rowProps} >
                <div className={`capitalize badge ${useStatus(`${prefix ?? ''}${value}`)}`}>{useStatusLabel(`${prefix ?? ''}${value}`)}</div>
              </RowLabel>
            </div>
          )
        }

        if (header.type == 'date') {
          return (
            <div key={i}>
              <RowLabel label={header.label} {...rowProps} >
                {!!value && value != '-' ? dateFormat(value, header.dateFormat ?? null) : header?.defaultValue}
              </RowLabel>
            </div>
          )
        }

        if (header.type == 'currency') {
          let headerCurrencyCode = header.currency_code?.split(".")
          let currencyCode = 'IDR'
          if (headerCurrencyCode) {
            currencyCode = headerCurrencyCode.reduce((acc, key) => acc?.[key], data)
          }

          if (value == 0) {
            value = '-'
          }

          return (
            <div key={i}>
              <RowLabel label={header.label} {...rowProps} >
                {isNumber(value) ? currency(value, "id-ID", currencyCode) : value}
              </RowLabel>
            </div>
          )
        }

        if (header.type == "list") {
          const values = value.split("\n")
          let isEmpty = false
          if (values?.length == 0) {
            isEmpty = true
          }
          if (values?.length == 1 && values[0] == "") {
            isEmpty = true
          }

          let listClassName = header?.listClassName ?? "list-disc list-inside"

          return (
            <div key={i}>
              <RowLabel label={header.label} {...rowProps} wrapperClassName='grid' >
                {isEmpty ? '-' : (
                  <ul className={`${listClassName}`}>
                    {values.map((value, index) => (
                      <li key={index}>{value}</li>
                    ))}
                  </ul>
                )}
              </RowLabel>
            </div>
          )
        }

        if (!!actionUrl) {
          return (
            <RowLabel label={header.label} {...rowProps} >
              <Link href={actionUrl} className="underline">
                {useLang(value)}
              </Link>
            </RowLabel>
          )
        }


        return (
          <div key={i}>
            <RowLabel label={header.label} {...rowProps} >
              {isModalDetail ? (
                <ModalButton id={`detail_${data?.id}`} onClick={() => setShow(data)}>
                  <span>{value}</span>
                </ModalButton>
              ) : useLang(value)}
            </RowLabel>
          </div>
        )
      })}
    </div>
  )
}

export default DetailModalItem
