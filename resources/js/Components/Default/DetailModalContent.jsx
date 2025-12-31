import DetailModalItem from './DetailModalItem'

const DetailModalContent = (data, tableHeader) => {
  return (
    <div className="w-full border p-2">
      <DetailModalItem data={data} tableHeader={tableHeader} />
    </div>
  )
}
export default DetailModalContent