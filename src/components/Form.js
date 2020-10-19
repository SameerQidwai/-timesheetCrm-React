import React, { Component } from 'react'
import { 
    InputNumber, 
    Typography, 
    DatePicker,
    TimePicker,
    Checkbox, 
    Divider,
    Button, 
    Select, 
    Switch, 
    Radio, 
    Input, 
    Space,
    Form, 
    Row, 
    Col, 
        } from 'antd';

const { Item } = Form;
const { RangePicker } = DatePicker;
const TimeRange = TimePicker.RangePicker
const { Title } = Typography;

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not validate email!',
        number: '${label} is not a validate number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};



class Forms extends Component {
    constructor(props){
        super(props);
        // this.FormFields = this.props.FormFields
        console.log("FORM props:",this.props);
        // console.log(this.FormFields)
    }

    onFinishs = (value) => {
        // console.log(this.props)
        // value ={
        //     ...value,
        // }
        this.props.Callback(value);
    };

    content = () => {
        console.log("FORM RENDER:", this.props.FormFields);
        const {FormFields} = this.props;
        // console.log(Rows)
        const fields = FormFields.fields
        const btns = FormFields.btns ? FormFields.btns : {}
        const subBtn = btns.btn ? btns.btn : []
        return (
            <div>
            <Row justify={FormFields.justify} style={FormFields.backstyle}>
                <Col span={FormFields.FormCol}>
                    <Form
                        id= {FormFields.formId}
                        ref={FormFields.formId}
                        style={FormFields.Formstyle}
                        name="nest-messages"
                        onFinish={this.onFinishs} 
                        validateMessages={validateMessages}
                        scrollToFirstError={true} 
                        size={FormFields.size}
                        layout={FormFields.FormLayout}
                        initialValues={FormFields.initialValues}
                    >
                        {FormFields.fields?
                            // <Col span={FormFields.RowFiledCol}>
                            <>
                                {fields.map((item,j) => (
                                    <Col span={item.filedCol}  offset={item.filedOffset} key={j+1} style={item.style} >
                                        <Item 
                                            {...item.layout} 
                                            name={[item.object, item.key]} 
                                            extra={item.hint} 
                                            labelAlign={item.labelAlign} 
                                            label={item.label} 
                                            rules={item.rules}
                                            valuePropName={item.valuePropName}
                                            hidden={item.hidden===true}
                                            style={item.formStyle}
                                        >
                                            {this.filedformat(
                                                item.type, 
                                                item.Placeholder, 
                                                item.data, 
                                                item.mode, 
                                                item.rangMin,
                                                item.rangMax,
                                                item.default,
                                                item.showTime, 
                                                item.shape,
                                                item.size,
                                                item.func,
                                                item.fieldStyle
                                            )}
                                        </Item>
                                    </Col>
                                ))
                                }
                            </>
                        :
                            <span/>
                        }
                        {  btns.btn? //NAt in use corrently.. save it for sometime
                            <Col span={btns.filedCol} offset={btns.filedOffset}>
                                <Row justify={btns.justify}>
                                    <Item style={btns.style}>
                                        <Space size={btns.size}>
                                            {subBtn.map((item,j) => (
                                                <Button
                                                    key={j}
                                                    type={item.type}
                                                    htmlType={item.htmlType} 
                                                    size={item.size} 
                                                    hidden={item.hidden}
s                                                >
                                                    {item.placeholder}
                                                </Button>
                                            ))}
                                        </Space>
                                    </Item>
                                </Row>
                            </Col>
                            :
                            <span/>
                        }
                    </Form>
                </Col>
            </Row>
            </div>
        )
    }

    filedformat = (type, placeholder, data, mode, min, max, defaultValue, showTime, shape, size,func,style) =>{
        let item =null
        switch (type) { 
            case 'Password': 
                item = <Input.Password placeholder={placeholder} size={size}/>
                break;
            case 'Textarea': 
                item = <Input.TextArea placeholder={placeholder}  allowClear size={size} defaultValue={defaultValue}/>
                break;
            case 'InputNumber': 
                item = <InputNumber placeholder={placeholder} min={min} max={max}  size={size} defaultValue={defaultValue}/>
                break;
            case 'Select': 
                item = <Select placeholder={placeholder} options={data} mode={mode}  showArrow size={size} allowClear onChange={func} defaultValue={defaultValue}/>
                break;
            case 'shouldUpdate':  // can compare field value while typing via Should Update check it here https://ant.design/components/form/#components-form-demo-dynamic-rule
                item = <Input /> // is not working just to remember
                break;
            case 'Switch':
                item =  <Switch size={size} defaultValue={defaultValue}/>
                break;
            case 'Radio':
                item =  <Radio.Group options={data} optionType={mode} size={size} defaultValue={defaultValue}/>
                break;
            case 'DatePicker':
                item = <DatePicker picker={mode} showTime={showTime} size={size} defaultValue={defaultValue} />
                break;
            case 'TimePicker':
                item = <TimePicker format="h:mm a" use12Hours={mode==='use12Hours'} size={size} defaultValue={defaultValue}/>
                break;
            case 'TimeRange':
                item = <TimeRange format="h:mm a" use12Hours={mode==='use12Hours'} size={size} defaultValue={defaultValue}/>
                break;
            case 'RangePicker':
                item = <RangePicker picker={mode} showTime={showTime}  size={size} defaultValue={defaultValue}/>
                break;
            case 'CheckboxGroup':
                item = <Checkbox.Group options={data} size={size} defaultValue={defaultValue} />
                break;
            case 'Checkbox':
                item = <Checkbox options={data}  size={size} defaultValue={defaultValue}/>
                break;
            case 'Title':
                item = <Title level={mode} size={size} defaultValue={defaultValue}>{placeholder}</Title>
                break;
            case 'Span':
                item = <span style={style} onClick={func}>{placeholder}</span>
                break;
            case 'Divider':
                item = <Divider type={mode} style={shape}></Divider>
                break;
            case 'Button':
                item = <Button type={mode} shape={shape} block={max} onClick={func} size={size} >{placeholder}</Button>
                break;
            default: 
                item = <Input placeholder={placeholder} defaultValue={size} size={size} defaultValue={defaultValue}/>
        }
        return item
    }

    render() {
        return (
           this.content()
        )
    }
}

export default Forms

