import { useForm } from "@inertiajs/react"
import { useState, useRef, useEffect } from "react"
import { GridContextProvider, GridDropZone, GridItem, swap, move } from "react-grid-dnd"

const DraggableFeatured = ({ products, setData }) => {
  const onChangeDrag = (sourceId, sourceIndex, targetIndex, targetId) => {
    const result = swap(products, sourceIndex, targetIndex)
    const indexed = result.map((el, i) => ({ ...el, sort_number: i + 1 }))
    setData((state) => ({
      ...state,
      products: indexed,
    }))
  }

  return (
    <div className={`dnd relative`}>
      <GridContextProvider onChange={onChangeDrag}>
        <div className="container">
          <GridDropZone className="dropzone" boxesPerRow={4} rowHeight={270}>
            {products.map((item) => (
              <GridItem key={item.id}>
                <div className="grid-item">
                  <div className="grid-item-content bg-white">
                    <img
                      draggable={false}
                      className="h-[150px] object-cover w-full touch-none"
                      src={item.thumbnail || "https://backoffice.proyekin.id/storage/thumbnail/proyekin-default.png"}
                    />
                    <div className="p-2 flex flex-col h-[100px] justify-between">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs">Created by:{item.user.name}</p>
                    </div>
                  </div>
                </div>
              </GridItem>
            ))}
          </GridDropZone>
        </div>
      </GridContextProvider>
    </div>
  )
}

export default DraggableFeatured
