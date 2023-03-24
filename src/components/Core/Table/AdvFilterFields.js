
export const EmployeeFilterFields= [
    {
      fieldCol: 12, // this is only label 5
      size: 'small',
      Placeholder: 'First Name',
      type: 'Text',
      labelAlign: 'left',
    },
    {
      Placeholder: 'Last Name',
      fieldCol: 12, // this is only label 8
      size: 'small',
      type: 'Text',
      labelAlign: 'left',
    },
    {
      object: 'obj', //this is field 7
      fieldCol: 12,
      key: 'firstName',
      size: 'small',
      type: 'Input',
      labelAlign: 'left',
    },
    {
      object: 'obj', //this is field 9
      fieldCol: 12,
      key: 'lastName',
      size: 'small',
      type: 'Input',
      labelAlign: 'left',
    },
    {
      Placeholder: 'Phone',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
    },
    {
      fieldCol: 12, // this is only label 4
      size: 'small',
      Placeholder: 'Personal Email',

      type: 'Text',
      labelAlign: 'left',
    },
    {
      object: 'obj',
      fieldCol: 12,
      key: 'phoneNumber',
      size: 'small',
      type: 'input',
    },
    {
      object: 'obj', //this is field 6
      fieldCol: 12,
      key: 'email',
      size: 'small',
      type: 'Input',
    },
    {
      Placeholder: 'Gender',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
    },
    {
      Placeholder: 'State For Payroll Tax Purpose',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
    },
    {
      object: 'obj',
      fieldCol: 12,
      key: 'gender',
      mode: 'multiple',
      customValue: (value, option) => option,
      size: 'small',
      data: [
        { label: 'Male', value: 'M' },
        { label: 'Female', value: 'F' },
        { label: 'Other', value: 'O' },
      ],
      type: 'Select',
    },
    {
      object: 'obj',
      fieldCol: 12,
      mode: 'multiple',
      customValue: (value, option) => option,
      key: 'stateId',
      size: 'small',
      type: 'Select',
      data: [],
    },
    {
      Placeholder: 'Role',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
    },
    {
      Placeholder: 'Clearance Level',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
    },
    {
      object: 'obj',
      fieldCol: 12,
      mode: 'multiple',
      key: 'role',
      customValue: (value, option) => option,
      size: 'small',
      type: 'Select',
      data: [],
    },
    {
      object: 'obj',
      fieldCol: 12,
      key: 'clearanceLevel',
      size: 'small',
      mode: 'multiple',
      customValue: (value, option) => option,
      data: [
        { label: 'BV - Baseline Vetting', value: 'BV' },
        { label: 'NV1 - Negative Vetting 1', value: 'NV1' },
        { label: 'NV2 - Negative Vetting 2', value: 'NV2' },
        { label: 'PV - Positive Vetting', value: 'PV' },
        { label: 'No clearance', value: 'NC' },
      ],
      type: 'Select',
    },
    {
      Placeholder: 'Status',
      fieldCol: 24,
      size: 'small',
      type: 'Text',
    },
    {
      object: 'obj',
      fieldCol: 12,
      mode: 'multiple',
      key: 'isActive',
      customValue: (value, option) => option,
      size: 'small',
      type: 'Select',
      data: [
        {value:true, label: 'Active'},
        {value:false, label: 'Deactive'},
      ],
    },
    // {
    //   Placeholder: 'Employment Status',
    //   fieldCol: 12,
    //   size: 'small',
    //   type: 'Text',
    // },
    // {
    //   Placeholder: 'Leave Policy',
    //   fieldCol: 12,
    //   size: 'small',
    //   type: 'Text',
    // },
    // {
    //   object: 'obj',
    //   fieldCol: 12,
    //   key: 'employeeStatus',
    //   size: 'small',
    //   mode: 'multiple',
    //   customValue: (value, option) => option,
    //   data: [
    //     { label: 'Casual', value: 1 },
    //     { label: 'Part Time', value: 2 },
    //     { label: 'Full Time', value: 3 },
    //   ],
    //   type: 'Select',
    // },
    // {
    //   object: 'obj',
    //   fieldCol: 12,
    //   key: 'leaveRequestPolicyId',
    //   size: 'small',
    //   mode: 'multiple',
    //   customValue: (value, option) => option,
    //   data: [ ],
    //   type: 'Select',
    // },
    // {
    //   Placeholder: 'Contract Start Date',
    //   fieldCol: 12,
    //   size: 'small',
    //   type: 'Text',
    // },
    // {
    //   Placeholder: 'Contract End Date',
    //   fieldCol: 12,
    //   size: 'small',
    //   type: 'Text',
    // },
    // {
    //   object: 'obj',
    //   fieldCol: 12,
    //   key: 'contractStartDate',
    //   size: 'small',
    //   type: 'RangePicker',
    //   fieldStyle: { width: '100%' },
    // },
    // {
    //   object: 'obj',
    //   fieldCol: 12,
    //   key: 'contractEndDate',
    //   size: 'small',
    //   type: 'RangePicker',
    //   fieldStyle: { width: '100%' },
    // },
    // {
    //   Placeholder: 'Pay Frequency',
    //   fieldCol: 12,
    //   size: 'small',
    //   type: 'Text',
    // },
    // {
    //   Placeholder: 'Annual Base Salary',
    //   fieldCol: 12,
    //   size: 'small',
    //   type: 'Text',
    // },
    // {
    //   object: 'obj',
    //   fieldCol: 12,
    //   key: 'payFrequency',
    //   size: 'small',
    //   mode: 'multiple',
    //   customValue: (value, option) => option,
    //   data: [{ label: 'Hourly', value: 1 },
    //   { label: 'Daily', value: 2 },
    //   { label: 'Weekly', value: 3 },
    //   { label: 'Fortnightly', value: 4 },
    //   { label: 'Monthly', value: 5 }
    //   ],
    //   type: 'Select',
    // },
    // {
    //   object: 'obj',
    //   fieldCol: 5,
    //   key: 'minSalary',
    //   Placeholder: "Min",
    //   size: 'small',
    //   shape: '$',
    //   type: 'InputNumber',
    //   fieldStyle: { width: '100%' },
    // },
    // {
    //     Placeholder: <SwapRightOutlined />,
    //     fieldCol: 1,
    //     size: 'small',
    //     type: 'Text',
    //   },
    // {
    //   object: 'obj',
    //   fieldCol: 5,
    //   key: 'maxSalary',
    //   Placeholder: "Max",
    //   size: 'small',
    //   shape: '$',
    //   type: 'InputNumber',
    //   fieldStyle: { width: '100%' },
    // },
    // {
    //   Placeholder: 'Employee Manager',
    //   fieldCol: 24,
    //   size: 'small',
    //   type: 'Text',
    // },
    // {
    //   object: 'obj',
    //   fieldCol: 12,
    //   key: 'lineManagerId',
    //   size: 'small',
    //   mode: 'multiple',
    //   customValue: (value, option) => option,
    //   data: [],
    //   type: 'Select',
    // },
    {
      Placeholder: 'Residential Address',
      fieldCol: 24,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
    },
    {
      object: 'obj',
      fieldCol: 24,
      key: 'address',
      size: 'small',
      type: 'Input',
    },
]