import React, { Component } from "react";
import { InputNumber, Typography, DatePicker, TimePicker, Checkbox, Divider, Upload, Button, Select, Switch, Radio, Input, Space, Form, Row, Col, Tooltip} from "antd";

const { Item } = Form;
const { Dragger } = Upload;
const { RangePicker } = DatePicker;
const TimeRange = TimePicker.RangePicker;
const { Title, Text } = Typography;
const validateMessages = {
    required: "${label} is required!",
    types: {
        email: "${label} is not validate email!",
        number: "${label} is not a validate number!",
    },
    number: {
        range: "${label} must be between ${min} and ${max}",
    },
};

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

class Forms extends Component {
    constructor(props) {
        super(props);
        // [this.form] = Form.useForm();
        // this.formRef = React.createRef();
    }

    multipleUpload = (file, filelist, key, multiple) => {
        const { uploadKeys } = this.state;
        this.state.uploadKeys[key] = file;
        this.setState(
            {
                uploadKeys: { ...uploadKeys },
            }
        );
        return false;
    };

    formatter = (value, shape)=>{
        if (shape === "$"){
            return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }else if(shape === 'ABN'){ //17 136 900 313
            // return `${value}`.replace(/^(.{2})(.{3})(.*)$/, "$1 $2 $3")
            // return `${value}`.replace(/^(.{2})(.{3})(.{3})(.*)$/, "$1 $2 $3")
            // return `${value}`.substr(0, 2) + " " + `${value}`.substr(2, 5) + " " + `${value}`.substr(7, 10);
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
            // return `$ ${value}`.replace(/^(?:\d-?\d{10}|\d(?:[ \.]?\d){10})$/g)
        }else{
            return shape ? `${value}${shape}` : `${value}`
        }
    }

    parser = (value, shape) =>{
        if(shape === "$"){
            return value.replace(/\$\s?|(,*)/g, '')
        }else if(shape === 'ABN'){
            return value.replace(/\$\s?|(\s*)/g, '')
        }else{
            return shape ? value.replace(shape, "") : value
        }
    }


    onFinishs = (value) => {
        this.props.Callback(value);
    };

    content = () => {
        const { FormFields } = this.props;
        const fields = FormFields.fields;
        const btns = FormFields.btns ? FormFields.btns : {};
        const subBtn = btns.btn ? btns.btn : [];
        return (
            // <div>
            // {/* <Row justify={FormFields.justify} style={FormFields.backstyle} gutter={FormFields.FieldSpace}> */}
            <Col span={FormFields.FormCol}>
                <Form
                    id={FormFields.formId}
                    // ref={this.formRef}
                    ref={FormFields.formId}
                    style={FormFields.Formstyle}
                    name="nest-messages"
                    onFinish={this.onFinishs}
                    validateMessages={validateMessages}
                    scrollToFirstError={true}
                    size={FormFields.size}
                    layout={FormFields.FormLayout}
                    {...FormFields.layout}
                    initialValues={FormFields.initialValues}
                    preserve={FormFields.preserve===false? false : true}
                >
                    {FormFields.fields ? (
                        // <Col span={FormFields.RowfieldCol}>
                        // <Row justify={FormFields.justify} style={FormFields.backstyle} gutter={FormFields.FieldSpace} wrap={false}>
                        <>
                            {fields.map((item, j) => (
                                <Col
                                    span={item.fieldCol}
                                    offset={item.filedOffset}
                                    key={j + 1}
                                    hidden={item.hidden === true}
                                    style={item.style}
                                >
                                    <Item
                                        {...item.layout}
                                        name={[item.object, item.key]}
                                        extra={item.hint}
                                        labelAlign={item.labelAlign}
                                        label={item.label}
                                        labelCol={item.labelCol}
                                        wrapperCol={item.wrapperCol}
                                        rules={item.rules}
                                        valuePropName={item.valuePropName}
                                        getValueFromEvent={
                                            item.getValue && normFile
                                        }
                                        hidden={item.hidden === true}
                                        style={item.itemStyle}
                                        noStyle={item.noStyle}
                                    >
                                         { 
                                        //  item.tooltip ? 
                                        //     (<Tooltip title={item.tooltipTitle} trigger={item.tooltipTrigger}>
                                        //         {this.filedformat( item.type, item.Placeholder, item.data, item.mode, item.rangeMin, item.rangeMax, item.showTime, item.shape, item.size, item.fieldStyle, item.disabled, item.onChange, item.onClick, item.onBlur, item.onClear )}
                                        //     </Tooltip>) 
                                        //     :
                                            this.filedformat( item.type, item.Placeholder, item.data, item.mode, item.rangeMin, item.rangeMax, item.showTime, item.shape, item.size, item.fieldStyle, item.disabled, item.readOnly, item.onChange, item.onClick, item.onBlur, item.onClear, item.tooltip, item.tooltipTitle, item.tooltipTrigger )
                                        }
                                    </Item>
                                </Col>
                            ))}
                        </>
                    ) : (
                        <span />
                    )}
                    {btns.btn ? ( //NAt in use corrently.. save it for sometime
                        <Col span={btns.fieldCol} offset={btns.filedOffset}>
                            <Row justify={btns.justify} style={btns.backstyle}>
                                <Item style={btns.style}>
                                    <Space size={btns.size}>
                                        {subBtn.map((item, j) => (
                                            <Button
                                                key={j}
                                                type={item.type}
                                                htmlType={item.htmlType}
                                                size={item.size}
                                                hidden={item.hidden}
                                                s
                                            >
                                                {item.placeholder}
                                            </Button>
                                        ))}
                                    </Space>
                                </Item>
                            </Row>
                        </Col>
                    ) : (
                        <span />
                    )}
                </Form>
            </Col>
            // {/* </Row> */}
            // </div>
        );
    };

    filedformat = ( type, placeholder, data, mode, min, max, showTime, shape, size, style, disabled, readOnly, onChange, onClick, onBlur, onClear, tooltip, tTitle, tTrigger ) => {
        let item = null;
        switch (type) {
            case "Title":
                item = (
                    <Title level={mode} size={size} style={style}>
                        { tooltip? <Tooltip title={tTitle} trigger={tTrigger}> {placeholder}</Tooltip> :   placeholder }
                    </Title>
                );
                break;
            case "Text":
                item = (
                    <Text strong={mode} onClick={onClick} style={style} disabled={disabled}>
                        { tooltip? <Tooltip title={tTitle} trigger={tTrigger}> {placeholder}</Tooltip> :   placeholder }
                        {min && <span style={{color: 'red'}}> * </span>}
                    </Text>
                );
                break;
            case "Password":
                item = (
                    <Input.Password
                        placeholder={placeholder}
                        visibilityToggle={mode}
                        size={size}
                        style={style}
                    />
                );
                break;
            case "Textarea":
                item = (
                    <Input.TextArea
                        placeholder={placeholder}
                        allowClear
                        // autoSize={mode}
                        autoSize={mode}
                        asize={size}
                        style={style}
                        prefix={mode}
                    />
                );
                break;
            case "InputNumber":
                item = (
                    <InputNumber
                        placeholder={placeholder}
                        min={min}
                        max={max}
                        size={size}
                        formatter={(value) => this.formatter(value, shape) }
                        parser={(value) => this.parser(value, shape) }
                        style={style}
                        onBlur={onBlur}
                        onChange={onChange}
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                );
                break;
            case "Select":
                item = (
                    <Select
                        placeholder={placeholder}
                        options={data}
                        mode={mode}
                        showArrow
                        showSearch
                        size={size}
                        allowClear
                        onChange={onChange}
                        onClear={onClear}
                        style={style}
                        optionFilterProp="label"
                        filterOption={
                            (input, option) =>
                                option.label
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={disabled}
                    />
                );
                break;
            case "Switch":
                item = <Switch size={size} style={style} />;
                break;
            case "Radio":
                item = (
                    <Radio.Group
                        options={data}
                        optionType={mode}
                        buttonStyle={shape}
                        size={size}
                        style={style}
                    />
                );
                break;
            case "Checkbox":
                item = (
                    <Checkbox
                        options={data}
                        size={size}
                        style={style}
                        onChange={onChange}
                    />
                );
                break;
            case "CheckboxGroup":
                item = (
                    <Checkbox.Group
                        options={data}
                        size={size}
                        style={style}
                        onChange={onChange}
                    />
                );
                break;
            case "DatePicker":
                item = (
                    <DatePicker
                        picker={mode}
                        showTime={showTime}
                        size={size}
                        style={style}
                        onBlur={onBlur}
                        onChange={onChange}
                        format={'DD/MM/YYYY'}
                    />
                );
                break;
            case "TimePicker":
                item = (
                    <TimePicker
                        format={showTime}
                        use12Hours={mode === "use12Hours"}
                        size={size}
                        style={style}
                    />
                );
                break;
            case "TimeRange":
                item = (
                    <TimeRange
                        format={showTime}
                        use12Hours={mode === "use12Hours"}
                        size={size}
                        style={style}
                    />
                );
                break;
            case "RangePicker":
                item = (
                    <RangePicker
                        picker={mode}
                        showTime={showTime}
                        size={size}
                        style={style}
                        format={'DD/MM/YYYY'}
                    />
                );
                break;
            case "Divider":
                item = <Divider type={mode} style={style}></Divider>;
                break;
            case "Button":
                item = (
                    <Button
                        type={mode}
                        shape={shape}
                        block={max}
                        style={style}
                        onClick={onClick}
                        size={size}
                    >
                        {placeholder}
                    </Button>
                );
                break;
            case "Upload":
                item = (
                    <Upload
                        name="logo"
                        action={mode}
                        listType="text"
                        multiple={max}
                        style={style}
                    >
                        {placeholder}
                    </Upload>
                );
                break;
            case "Dragger":
                item = (
                    <Dragger
                        name="logo"
                        action={mode}
                        listType="text"
                        multiple={true}
                        style={style}
                        beforeUpload={() => false}
                    >
                        {placeholder}
                    </Dragger>
                );
                break;
            default:
                item = (
                    <Input
                        placeholder={placeholder}
                        style={style}
                        size={size}
                        disabled={disabled}
                        readOnly={readOnly}
                        onBlur={onBlur}
                        onChange={onChange}
                    />
                );
        }
        return item;
    };

    render() {
        return this.content();
    }
}

export default Forms;
