fieldStyle = 'style directly to the field '
backstyle = 'style on the Row'
Formstyle =' style on the Form '
FormCol = 'form Column'
FieldSpace = 'Spaces between fields'
layout = 'set label column for alignment'
FormLayout = 'ant desingn has 3 layout // horizonta, vertical, inline'
fields= { //fileds
    
}
const FormFields = {
    // Title: 'OneLM CRM',
    justify : 'center',
    FormCol: 10,
    FieldSpace: { xs: 12, sm: 16, md: 122},
    layout: {labelCol: { span: 12 }},
    justifyField:'center',
    FormLayout:'vertical', 
    size: 'middle',
    Formstyle:{backgroundColor:'white'},
    backstyle:{backgroundColor:'green'},
    fields:[
        {
            object:'obj',
            filedCol:13,
            variable: 'name',
            Placeholder: 'Your Good Name',
            label:'Name',
            // rules:[{ required: true }],
            type: 'input',
            layout: {labelCol: { span: 0}},
            labelAlign: 'right',
            hint: 'write your Name',
        },
        {
            object:'obj',
            filedCol:13,
            variable: 'password',
            label:'Password',
            Placeholder: "You Don't Have Any",
            // rules:[{ required: true, message: 'Please input your password!' }],
            type: 'password',
            layout: {labelCol: { span: 0 }},
            labelAlign: 'right',
            hint: 'Nick Name',
        },
        {
            object:'obj',
            Placeholder: "You Don't Have Any",
            filedCol:12,
            variable: 'age',
            label:'Age',
            // rules:[{ type: 'number', min: 0, max: 99 }],
            rangMin: 1,
            rangMax:2,
            type: 'inputNumber',
            layout: {labelCol: { span: 8 }},
            labelAlign: 'right',
            hint: 'whats your Age'
        },
        {
            object:'obj',
            filedCol:10,
            variable: 'age',
            label:'Age',
            // rules:[{ required: true }],
            type: 'input',
            layout: {labelCol: { span: 8 }},
            labelAlign: 'right',
            hint: 'Age in Time',
        },
        {
            object:'obj',
            filedCol:10,
            variable: 'age',
            label:'Age',
            // rules:[{ required: true }],
            type: 'input',
            layout: {labelCol: { span: 8 }},
            labelAlign: 'right',
            hint: 'Age in Time',
        },
        {
            object:'obj',
            filedCol:10,
            variable: 'select1',
            label:'Select Me',
            // rules:[{ required: true }],
            type: 'select',
            layout: {labelCol: { span: 8 }},
            labelAlign: 'right',
            hint: 'You can select',
            mode: 'multiple',
            data:[
                {label:'sameer',value:0},
                {label:'Adii',value:1},
                {label:'caio',value:2}
            ]
        },
        {
            object:'obj',
            filedCol:10,
            variable: 'select2',
            label:'Select Me',
            // rules:[{ required: true }],
            type: 'select',
            layout: {labelCol: { span: 8 }},
            labelAlign: 'right',
            hint: 'You can select',
            mode: 'tag',
            data:[
                {label:'Mursal',value:0},
                {label:'Asad',value:1},
                {label:'Shohail',value:2}
            ]
        },
        {
            object:'obj',
            filedCol:10,
            variable: 'switch',
            label:'Switch',
            // rules:[{ required: true,  message: 'do it' }],
            type: 'switch',
            layout: {labelCol: { span: 8 }},
            labelAlign: 'right',
            hint: 'pick me',
            valuePropName:'checked' // passing an error if not 
        },
        {
            object:'obj',
            filedCol:10,
            variable: 'radio',
            label:'Radio-Group',
            // rules:[{ required: true }],
            type: 'radio',
            layout: {labelCol: { span: 8 }},
            labelAlign: 'right',
            hint: 'FM Radio',
            data:[
                {label:'Mursal',value:0,disabled:true},
                {label:'Asad',value:1},
                {label:'Shohail',value:2}
            ],
            default:2,
            mode: 'button'
        },
        {
            object:'obj',
            filedCol:10,
            variable: 'date',
            label:'Date',
            // rules:[{ required: true }],
            type: 'DatePicker',
            layout: {labelCol: { span: 8 }},
            labelAlign: 'left',
            hint: 'Whats your Date???',
            mode:'date',
        },
        {
            object:'obj',
            filedCol:10,
            variable: 'range',
            label:'Range Date',
            // rules:[{ required: true }],
            type: 'RangePicker',
            layout: {labelCol: { span: 8 }},
            labelAlign: 'left',
            hint: 'Whats your Range???',
            mode:'date',
        },
        {
            object:'obj2',
            filedCol:10,
            variable: 'check',
            label:'Checking',
            // rules:[{ required: true }],
            type: 'CheckboxGroup',
            layout: {labelCol: { span: 8 }},
            labelAlign: 'left',
            data:[
                {label:'Mursal',value:0,disabled:true},
                {label:'Asad',value:1},
                {label:'Shohail',value:2}
            ],
            hint: 'choose us...',
            valuePropName:'checked' // passing an error if not 
        },
        {
            object:'obj4',
            filedCol:10,
            variable: 'checkBox',
            label:'Checking',
            // rules:[{ required: true }],
            type: 'Checkbox',
            layout: {labelCol: { span: 8 }},
            labelAlign: 'left',
            hint: 'choose us...', 
            valuePropName:'checked' // passing an error if not 
        },
        { //lables
            object:'obj',
            filedCol:20,
            layout:  {
                wrapperCol: { span: 0 }
            },
            Placeholder: 'OLCRM usernmae',
            mode:5,
            type: 'Title',
        },
    ]
}