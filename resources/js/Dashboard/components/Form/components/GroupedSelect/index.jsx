import DropdownTreeSelect from 'react-dropdown-tree-select'
import * as React from 'react'
import './index.css'
import 'react-dropdown-tree-select/dist/styles.css'

export default function MyDropdownTree() {
  const data = [
    {
      label: 'Fruits',
      value: 'fruits',
      children: [
        {label: 'Apple', value: 'apple'},
        {label: 'Orange', value: 'orange'},
        {label: 'Banana', value: 'banana'},
      ],
    },
    {
      label: 'Vegetables',
      value: 'vegetables',
      children: [
        {
          label: 'Carrot',
          value: 'carrot',
        },
        {
          label: 'Broccoli',
          value: 'broccoli',
        },
        {
          label: 'Peas',
          value: 'peas',
        },
      ],
    },
  ]

  return (
    <DropdownTreeSelect
      data={data}
      onChange={() => {}}
      showCheckbox={true} // show checkboxes
      autoCheck={true} // enable autoCheck
      className="mdl-demo"
    />
  )
}
