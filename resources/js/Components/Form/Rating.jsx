import BaseForm from "./BaseForm"

const Rating = (props) => {
	const { name, handleChange, data, id = null, ref, disabled = false, readOnly = false, defaultChecked = false } = props
	let { className = 'rating w-max mx-auto', ratingTotal=5 } = props

  return (
    <BaseForm {...props} isLabel={false}>
      <div className={className}>
        {[...Array(ratingTotal)].map((_, index) =>(
          <input
            key={index}
            ref={ref}
            type={'radio'}
            onChange={handleChange}
            name={name}
            id={id ?? name}
            disabled={disabled}
            defaultChecked={defaultChecked}
            readOnly={readOnly}
            checked={data[name] == index + 1}
            value={index + 1}
            className={`cursor-pointer mask mask-star-2 bg-orange-500`}
          />
        ))}
      </div>
    </BaseForm>
  );
};

export default Rating;
