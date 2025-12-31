import { Accordion as BaseAccordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/Components/ui/accordion";
import { isFunction, useSearchParams } from "@/utlis/format";
import { usePage } from "@inertiajs/react";
import { useState } from "react";

function Accordion(props) {
  const { options, labelField, Content, type = 'single', collapsible = true, onChange = null, open = null, setOpen = null, defaultParams = null, Icon = null } = props
  const { customLabel = null } = props

  let defaultOpen = []
  if (defaultParams) {
    const { location } = usePage().props
    const { params } = useSearchParams(location);

    if (params.get(defaultParams)) {
      let opened = options.findIndex(m => m.id == params.get(defaultParams))
      if (opened != -1) {
        defaultOpen = [`item-${opened}`]
      }
    }
  }


  let [openValues, setOpenValues] = useState(defaultOpen);
  if (setOpen && isFunction(setOpen)) {
    setOpenValues = setOpen;
    openValues = open;
  }

  const handleValueChange = (value) => {
    let newValues = Array.isArray(value) ? value : value ? [value] : [];
    let opened = newValues.filter(v => !openValues.includes(v));
    let closed = openValues.filter(v => !newValues.includes(v));

    if (newValues?.length == 0) {
      newValues = [-1]
    }

    setOpenValues(newValues);

    if (isFunction(onChange)) {
      let activeItems = newValues[0] == -1 ? [] : options.filter((_, i) => newValues.includes(`item-${i}`));
      let openedItems = newValues[0] == -1 ? [] : options.filter((_, i) => opened.includes(`item-${i}`));
      let closedItems = options.filter((_, i) => closed.includes(`item-${i}`));

      onChange({
        active: activeItems,
        opened: openedItems,
        closed: closedItems
      });
    }
  };

  return (
    <BaseAccordion type={type} collapsible={collapsible} value={type === 'single' ? openValues[0] : openValues} onValueChange={handleValueChange}>
      {options.map((option, index) => {
        return (
          <AccordionItem key={index} value={`item-${index}`} className="border-b-2">
            <AccordionTrigger>
              {isFunction(customLabel) ? customLabel(option) : (
                <div className="flex gap-2 items-center">
                  {isFunction(Icon) ? <Icon data={option} /> : null}
                  <span>{option[labelField]}</span>
                </div>
              )}
            </AccordionTrigger>
            <AccordionContent>
              {isFunction(Content) ? <Content data={option} /> : null}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </BaseAccordion>
  );
}

export default Accordion;
