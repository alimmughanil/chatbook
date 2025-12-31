import useFormChange from '@/utils/useFormChange';
import { useForm, usePage } from '@inertiajs/react'
import { useMemo } from 'react';
import { getBasePageUrl } from './format';

function useFormBuilder(formProps) {
  const { isEdit = false, getProperties, onChange = null, onSubmit = null, initialData = {}} = formProps
  const { formOptions = {}} = formProps

  const { props } = usePage()
  let { page } = props

  if (isEdit) {
    page.data = props[page?.name]
  }

  let initialFormData = {}
  for (const field of page?.fields) {
    const valueFromData = page?.data?.[field.name];
    initialFormData[field.name] = valueFromData ?? field.defaultValue ?? '';
  }

  initialFormData = {...initialFormData, ...initialData}

  const form = useForm({
    ...initialFormData,
    ref_url: props.location,
  });

  const { data, setData, post, errors } = form

  const handleChange = (e) => {
    if (onChange) return onChange(e, data, setData)
    const { name, value } = useFormChange(e, data);

    setData((state) => ({
      ...state,
      [name]: value,
    }));
  }

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (onSubmit) return onSubmit(e, form)

    const pageUrl = getBasePageUrl(page?.url);

    if (page?.data) {
      data._method = 'put'
      let id = page?.data?.id
      if (!id && page?.data?.id_id) {
        id = page?.data?.id_id
      }
      if (!id && page?.data?.id_en) {
        id = page?.data?.id_en
      }
      if (pageUrl?.endsWith(id)) {
        return post(pageUrl), formOptions;
      }
      return post(`${pageUrl}/${id}`, formOptions);
    }
    return post(pageUrl, formOptions);
  };

  const inputProps = { data, errors, handleChange }
  const properties = useMemo(() => (
    getProperties({ ...inputProps, setData, props, isEdit })
  ), [data, errors, handleChange, onChange, isEdit, getProperties])


  return { form, properties, inputProps, handleChange, handleSubmit }
}

export const hiddenField = ({ data, header }, dependency, allowedValues = []) => {
  if (allowedValues.includes(data[dependency])) {
    header.isHidden = false
  } else{
    header.isHidden = true
  }

  return header
}

export default useFormBuilder
