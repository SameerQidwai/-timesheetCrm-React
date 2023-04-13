import { formatCurrency, formatFloat } from "../../../service/constant";
export const cash_inflows = [
  {},
  { 
    name: 'Cash Inflows',
    key: 'Cash Inflows',
    className: 'title-row' 
  },
  {
    name: 'Cash at Bank - Opening',
    key: 'Cash at Bank - Opening inflows',
    className: 'data-title-row',
    default: 0,
    partialEdit: 'Jul',
    editable: true,
    render:(key, record)=>{
      key = key.startsWith('FY')? 'total' : key
      return record[key] ? formatNegativeValue(record[key]) : '-'
    }
  },
  {
    name: 'Debtor Receipts',
    key: 'Debtor Receipts inflows',
    className: 'data-title-row',
    default: 0,
    editable: true,
  },
  {
    name: 'Other Inflows',
    key: 'Other Inflows inflows',
    className: 'data-title-row',
    editable: true,
  },
  {},
  {
    className: 'total-row',
    name: 'Total Inflows',
    key: 'Total Inflows',
    render:(key, record)=>{
      key = key.startsWith('FY')? 'total' : key
      return record[key] ? formatNegativeValue(record[key]) : '-'
    }
  },
];

export const cash_outflows = [
  {},
  { 
      name: 'Cash Outflows',
      key:'Cash Outflows outflows',
      className: 'title-row' 
  },
  { 
    name: 'Salary - Permanent',
    key:'Salary - Permanent outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Salary - Casual',
    key:'Salary - Casual outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Superannuation - Permanent',
    key:'Superannuation - Permanent outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Superannuation - Casual',
    key:'Superannuation - Casual outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Subcontractors',
    key:'Subcontractors outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Payroll Tax',
    key:'Payroll Tax outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Travel Claims',
    key:'Travel Claims outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Rent',
    key:'Rent outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Utilities',
    key:'Utilities outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Office Supplies',
    key:'Office Supplies outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Telephone & Mobiles',
    key:'Telephone & Mobiles outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'IT Expenses',
    key:'IT Expenses outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Accounting Fee',
    key:'Accounting Fee outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Insurance',
    key:'Insurance outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Software Fee',
    key:'Software Fee outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Business Travel',
    key:'Business Travel outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Entertainments',
    key:'Entertainments outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Other General Expense',
    key:'Other General Expense outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name:'ATO GST Payment',
    key:'ATO GST Payment outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name:'ATO PAYG W/Tax Payment',
    key:'ATO PAYG W/Tax Payment outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name:'ATO Income Tax Payment',
    key:'ATO Income Tax Payment outflows',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Other Outflows',
    key: 'Other Outflows outflows',
    className: 'data-title-row',
    editable: true,
  },
  {},
  {},
  {
    className: 'total-row',
    name: 'Total Outflows',
    key: 'Total Outflows',
    render:(key, record)=>{
      key = key.startsWith('FY')? 'total' : key
      return record[key] ? formatNegativeValue(record[key])  : '-'
    }
  },
];

export const closing_cashflows = [
  {},
  {
    className: 'total-row',
    name: 'Surplus (Shortffall)',
    key: 'Surplus (Shortffall)',
    renderCalculation: (record, key) =>{
      key = key.startsWith('FY')? 'total' : key
      return  (getValueWithCondition(record, 6, key) - getValueWithCondition(record, 33, key))
    },
    render:(key, record)=>{
      key = key.startsWith('FY')? 'total' : key
      return record[key] ? formatNegativeValue(record[key])  : '-'
    }
  },
  {
    className: 'total-row',
    name: 'Cash at Bank - Closing',
    key: 'Cash at Bank - Closing',
    renderCalculation: (record, key) =>{
      key = key.startsWith('FY')? 'total' : key
      return  (getValueWithCondition(record, 6, key) - getValueWithCondition(record, 33, key))
    },
    render:(key, record)=>{
      key = key.startsWith('FY')? 'total' : key
      return record[key] ? formatNegativeValue(record[key])  : '-'
    }
  },
  {}
]

/**------------------Helper ------ function */

export const nextFocus = () => {
  let focusObject = {};
  const array = new Array (
    ...cash_inflows,
    ...cash_outflows,
  )
  let prev = 0
  for (let i = 1; i < array.length; i++) {
    let curr = array[i];
    if (curr.editable) {
      if (prev){
        focusObject[prev.key] = curr.key;
      }
      prev = curr;
    }
  }
  focusObject['Other Outflows outflows'] = 'Debtor Receipts inflows'
  return focusObject;
}

export const getValueWithCondition = (obj, index, key) => {
  if (!obj || !obj[index]) return 0;

  let value = key ? obj[index][key] : obj[index];
  return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
}

export const formatNegativeValue = (value, format) =>{
  return format === 'float' ?
  `${ value < 0 ? `(${formatFloat(Math.abs(value))})` : formatFloat(value) } %`
  :
  `${ value < 0 ? `(${formatCurrency(Math.abs(value))})` : formatCurrency(value) }`;
}