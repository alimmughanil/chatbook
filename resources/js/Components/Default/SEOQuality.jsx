import SEOEvaluator from "../SEO/SEOEvaluator"
// import ReadabilityEvaluator from "../SEO/ReadabilityEvaluator"

const SEOQuality = (props) => {
  const { property, inputProps, lang } = props
  const { data } = inputProps
  const { name } = property.props
  let keyword = data[name] || ''
  keyword = keyword.split(',').map((item) => item.trim()).filter(Boolean)
  keyword = keyword.at(-1)
  if (!keyword) return <></>

  return (
    <div className="w-full">
        <SEOEvaluator data={data} keyword={keyword} lang={lang} />
        {/* <ReadabilityEvaluator data={data} lang={lang} /> */}
    </div>
  )
}
export default SEOQuality