import { formatCurrency, formatFloat } from "../../../service/constant";

export const income_revenue = [
  { 
    name: 'INCOME/REVENUE',
    key: 'INCOME/REVENUE',
    identifier: 'revenue_total',
    className: 'title-row' 
  },
  {
    name: 'Revenue - T&M Basis',
    identifier: 'revenue_total',
    key: 'Revenue - T&M Basis',
    className: 'data-title-row',
    default: 0,
  },
  {
    name: 'Revenue - Milestone Basis',
    identifier: 'revenue_total',
    key: 'Revenue - Milestone Basis',
    className: 'data-title-row',
    default: 0,
  },
  {
    name: 'Revnue - Other',
    identifier: 'revenue_total',
    key: 'Revnue - Other',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Revenue - Security Clearance Fee',
    identifier: 'revenue_total',
    key: 'Revenue - Security Clearance Fee',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Misc Income',
    identifier: 'revenue_total',
    key: 'Misc Income',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Adjustment',
    identifier: 'revenue_total',
    key: 'Revenue - Adjustment',
    className: 'data-title-row',
    editable: true,
  },
  {},
  {
    className: 'total-row',
    name: 'TOTAL REVENUE',
    identifier: 'revenue_total',
    key: 'TOTAL REVENUE',
    render:(key, record)=>{
      key = key.startsWith('FY')? 'total' : key
      return record[key] ? formatNegativeValue(record[key]) : '-'
    }
  },
];

export const cost_of_sale = [
  {},
  { 
      name: 'COST OF SALES - COS', 
      key: 'COST OF SALES - COS cos', 
      identifier: 'cost_total',
      className: 'title-row' 
  },
  {
    name: 'Salaries & Wages - Permanent',
    key: 'Salaries & Wages - Permanent cos',
    identifier: 'cost_total',
    className: 'data-title-row',
  },
  {
    name: 'Salaries & Wages - Casual',
    key: 'Salaries & Wages - Casual cos',
    identifier: 'cost_total',
    className: 'data-title-row',
  },
  {
    name: 'Salaries & Wages - Subcontractor',
    key: 'Salaries & Wages - Subcontractor cos',
    identifier: 'cost_total',
    className: 'data-title-row',
    default: 0
  },
  {
    name: 'Superannuation - Permanent',
    key: 'Superannuation - Permanent cos',
    identifier: 'cost_total',
    className: 'data-title-row',
  },
  {
    name: 'Superannuation - Casual',
    key: 'Superannuation - Casual cos',
    identifier: 'cost_total',
    className: 'data-title-row',
  },
  {
    name: 'Bonus/STI',
    key: 'Bonus/STI cos',
    className: 'data-title-row',
    identifier: 'cost_total',
    editable: true,
  },
  {
    name: 'Superannuation on Bonus/STI',
    key: 'Superannuation on Bonus/STI cos',
    identifier: 'cost_total',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Employee Leave Entitlements AL/LSL',
    key: 'Employee Leave Entitlements AL/LSL cos',
    identifier: 'cost_total',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Training & Education',
    key: 'Training & Education cos',
    identifier: 'cost_total',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Recruitment Expenses',
    key: 'Recruitment Expenses cos',
    identifier: 'cost_total',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Staff amenities',
    key: 'Staff amenities cos',
    identifier: 'cost_total',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Fringe Benefits Tax',
    key: 'Fringe Benefits Tax cos',
    identifier: 'cost_total',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Subcontractor Services',
    key: 'Subcontractor Services cos',
    identifier: 'cost_total',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Payroll Tax',
    key: 'Payroll Tax cos',
    className: 'data-title-row',
    identifier: 'cost_total',
    editable: true,
  },
  {
    name: 'Security Clearance Sponsorship',
    key: 'Security Clearance Sponsorship cos',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Travel - Client Funded',
    key: 'Travel - Client Funded cos',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Travel - Milestone Inclusive',
    key: 'Travel - Milestone Inclusive cos',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Membership Fee',
    key: 'Membership Fee cos',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Adjustment',
    key: 'Adjustment cos',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Cost of Opportunities',
    key: 'Cost of Opportunities',
    className: 'data-title-row',
  },
  {},
  {},
  {
    className: 'total-row',
    name: 'TOTAL COST OF SALES - COS',
    key: 'TOTAL COST OF SALES - COS cos',
    render:(key, record)=>{
      key = key.startsWith('FY')? 'total' : key
      return record[key] ? formatNegativeValue(record[key])  : '-'
    }
  },
];

export const contribution_margin = [
  {},
  {
    className: 'total-row',
    name: 'CONTRIBUTION MARGIN',
    key: 'CONTRIBUTION MARGIN',
    renderCalculation: (record, key) =>{
      key = key.startsWith('FY')? 'total' : key
      return getValueWithCondition(record, 8, key)  - getValueWithCondition(record, 33, key)
    },
    render:(key, record)=>{
      key = key.startsWith('FY')? 'total' : key
      return formatNegativeValue(record[key]) 
    }
  },
  {},
  {
    className: 'total-row',
    name: 'C.M. %',
    key: 'C.M. %',
    renderCalculation: (record, key) =>{
      key = key.startsWith('FY')? 'total' : key
      let revenue = getValueWithCondition(record, 8, key)
      return revenue ? ((revenue - getValueWithCondition(record, 33, key)) /revenue) *100: 0.00
    },
    render:(key, record)=>{
      key = key.startsWith('FY')? 'total' : key
      return formatNegativeValue(record[key], 'float') 
    }
  },
  {}
]

export const direct_overhead_expense = [
  {},
  {
    name: 'DIRECT OVERHEAD - DOH',
    key: 'DIRECT OVERHEAD - DOH doh',
    className: 'title-row',
  },
  {
    name: 'Salaries & Wages - Permanent',
    key: 'Salaries & Wages - Permanent doh',
    className: 'data-title-row',
  },
  {
    name: 'Superannuation - Permanent',
    key: 'Superannuation - Permanent doh',
    className: 'data-title-row',
  },
  {
    name: 'Salaries & Wages - Casual',
    key: 'Salaries & Wages - Casual doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Superannuation - Casual',
    key: 'Superannuation - Casual doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Travel Allowances',
    key: 'Travel Allowances doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Bonus/STI',
    key: 'Bonus/STI doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Employee Leave Entitlements AL/LSL',
    key: 'Employee Leave Entitlements AL/LSL doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Subcontractor Services',
    key: 'Subcontractor Services doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Payroll Tax',
    key: 'Payroll Tax doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Other Personnel Expenses',
    key: 'Other Personnel Expenses doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Occupancy Expenses ',
    key: 'Occupancy Expenses doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Equipment Expenses ',
    key: 'Equipment Expenses doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Communication Expenses ',
    key: 'Communication Expenses doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Outside Services Expenses ',
    key: 'Outside Services Expenses doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Travel Expenses',
    key: 'Travel Expenses doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Entertainment - Client ',
    key: 'Entertainment - Client doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Entertainment - Staff ',
    key: 'Entertainment - Staff doh',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Other General Expenses ',
    key: 'Other General Expenses doh',
    className: 'data-title-row',
    editable: true,
  },
  {},
  {
    className: 'total-row',
    name: 'TOTAL DIRECT OVERHEAD - DOH',
    key: 'TOTAL DIRECT OVERHEAD - DOH doh',
  },
];

export const income_tax = [
  {},
  {
    className: 'total-row',
    name: 'EARNINGS BEFORE INCOME TAX - EBIT',
    key: 'EARNINGS BEFORE INCOME TAX - EBIT',
    renderCalculation: (record, key) =>{
      key = key.startsWith('FY')? 'total' : key
      return getValueWithCondition(record, 8, key) -
      getValueWithCondition(record, 33, key) -
      getValueWithCondition(record, 60, key);
    },
    render:(key, record)=>{
      key = key.startsWith('FY')? 'total' : key
      return record[key] ? formatNegativeValue(record[key])  : '-'
    }
  },
  {},
  {
    name: 'Interest Income',
    key: 'Interst Income tax',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Interest Expense',
    key: 'Interest Expense tax',
    operation: '-',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Indirect Overhead',
    key: 'Indirect Overhead tax',
    operation: '-',
    className: 'data-title-row',
    editable: true,
  },
  {
    name: 'Other Income',
    key: 'Other Income tax',
    className: 'data-title-row',
    editable: true,
  },
]

export const net_profit = [
  {
    className: 'total-row',
    name: 'PROFIT BEFORE TAX',
    key: 'PROFIT BEFORE TAX profit',
    renderCalculation: (record, key) =>{
      key = key.startsWith('FY')? 'total' : key
      return getValueWithCondition(record, 62, key) +
      getValueWithCondition(record, 64, key) -
      getValueWithCondition(record, 65, key) -
      getValueWithCondition(record, 66, key) +
      getValueWithCondition(record, 67, key) 
    },
    render:(key, record)=>{
      key = key.startsWith('FY')? 'total' : key
      return  formatNegativeValue(record[key]) 
    }
  },
  {},
  {
    name: 'Income Tax Expense',
    key: 'Income Tax Expense profit',
    className: 'data-title-row',
    renderCalculation: (record, key, incomeTax) =>{
      key = key.startsWith('FY')? 'total' : key
      return getValueWithCondition(record, 68, key) * incomeTax
      
    },
    render:(key, record)=>{
      key = key.startsWith('FY')? 'total' : key
      return  formatNegativeValue(record[key]) 
    }
  },
  {},
  {
    className: 'total-row',
    name: 'NET PROFIT',
    key: 'NET PROFIT profit',
    renderCalculation: (record, key, incomeTax) =>{
      key = key.startsWith('FY')? 'total' : key
      return getValueWithCondition(record, 68, key) -
      (getValueWithCondition(record, 68, key) * incomeTax)
    },
    render:(key, record)=>{
      key = key.startsWith('FY')? 'total' : key
      return formatNegativeValue(record[key])
    }
  },
]

// export const occupancy_expenses = [
//     {},
//     { name: 'OCCUPANCY EXPENSES', className: 'title-row' },
//     {
//         name: 'Rent - Office',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Rent - Other Cost',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Office Maintenance',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Electricity',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Water',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Rates',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {},
// ]

// export const supplies_expenses = [
//     {},
//     { name: 'SUPPLIES & EQUIPMENT EXPENSES' , className: 'title-row' },
//     {
//         name: 'Office Supplies & Staionery',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Office Equipments',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Repair & Maint - Office Equip',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Depreciation Charge',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
// ]

// export const comunication_expenses = [
//     {},
//     { name: 'COMMUNICATION EXPENSES' , className: 'title-row' },
//     {
//         name: 'Telephone & Mobile Phones',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Internet Expenses',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'RPostage',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'IT Services - Microsoft Exchange Fee',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
// ]

// export const outside_expenses = [
//     {},
//     { name: 'OUTSIDE SERVICES EXPENSES' , className: 'title-row' },
//     {
//         name: 'Accounting & Legal Fees',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Consulting Fees',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Advertising and Promotion',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Insurance - Business & WorkSafe',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Software Exp - MYOB Subscription',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {},
// ]

// export const travel_entertainment_expenses = [
//     {},
//     { name: 'TRVEL & ENTERTAINMENT EXPENSES' , className: 'title-row' },
//     {
//         name: 'Travel - AGIS Funded',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Office Catering/Entertainment',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Employee Conference & Function',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Business Entertainment',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Business Conference & Function',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {},
// ]

// export const other_general_expenses = [
//     {},
//     { name: 'OTHER GENERAL EXPENSES' , className: 'title-row' },
//     {
//         name: 'Membership Fee',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Donation & Subscription',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Licence & Registration Fee',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Bank Charges',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {
//         name: 'Other General Expenses',
//         className: 'data-title-row',
//         // 'Jul 20':0,
//         // 'Aug 20':0,
//         // 'Sep 20':0,
//         // 'Oct 20':0,
//         // 'Nov 20':0,
//         // 'Dec 20':0,
//         // 'Jan 21':0,
//         // 'Feb 21':0,
//         // 'Mar 21':0,
//         // 'Apr 21':0,
//         // 'May 21':0,
//         // 'Jun 21':0,
//     },
//     {},
// ]



/**------------------Helper ------ function */

export const nextFocus = () => {
  console.log('setted focus')
  let focusObject = {};
  const array = new Array (
    ...income_revenue,
    ...cost_of_sale,
    ...contribution_margin,
    ...direct_overhead_expense,
    ...income_tax,
    ...net_profit
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
  focusObject['Income Tax Expense profit'] = 'Revenue - Security Clearance Fee'
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