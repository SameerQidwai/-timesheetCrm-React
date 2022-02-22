import React, { Component } from "react";
import { InputNumber, Typography, DatePicker, TimePicker, Checkbox, Divider, Upload, Button, Select, Switch, Radio, Input, Space, Form, Row, Col, Tooltip} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"; //Icons

const { Item } = Form;
const { Dragger } = Upload;
const { RangePicker } = DatePicker;
const TimeRange = TimePicker.RangePicker;
const { Title, Text } = Typography;

const normFile = (e) => {
    // console.log("Upload event:");
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

class FormItems extends Component {
    constructor(props) {
        super(props);
        // [this.form] = Form.useForm();
        // this.formRef = React.createRef();
    }

    multipleUpload = (file, filelist, key, multiple) => {
        console.log(file, filelist, key, multiple);
        const { uploadKeys } = this.state;
        console.log("multipleUpload", file, key, multiple, uploadKeys);
        this.state.uploadKeys[key] = file;
        this.setState(
            {
                uploadKeys: { ...uploadKeys },
            },
            () => {
                console.log(this.state);
            }
        );
        return false;
    };

    formatter = (value, shape)=>{
        if (shape === "$"){
            return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }else if(shape === 'ABN'){ //17 136 900 313
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
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


    onFinish = (value) => {
        this.props.Callback(value);
    };

    content = () => {
        const { FormFields: fields, listName} = this.props;
        return (
            fields.map((item, j) => (
                <Col
                    span={item.fieldCol}
                    offset={item.filedOffset}
                    key={j + 1}
                    style={item.style}
                >
                    <Item
                        {...item.layout}
                        name={[listName??item.object, item.key]}
                        extra={item.hint}
                        labelAlign={item.labelAlign}
                        label={item.label}
                        labelCol={item.labelCol}
                        wrapperCol={item.wrapperCol}
                        rules={item.rules}
                        valuePropName={item.valuePropName}
                        getValueFromEvent={item.customValue}
                        hidden={item.hidden === true}
                        style={item.itemStyle}
                        noStyle={item.noStyle}
                    >
                        { 
                            this.filedformat( 
                                item.type, item.Placeholder, item.data, item.mode, item.rangeMin, item.rangeMax, item.showTime, item.shape, 
                                item.size, item.fieldStyle, item.disabled, item.readOnly, item.onChange, item.onClick, item.onBlur, 
                                item.onClear, item.tooltip, item.tooltipTitle, item.tooltipTrigger, item.fieldNames
                            )
                        }
                    </Item>
                </Col>
            ))
               
        );
    };

    filedformat = ( type, placeholder, data, mode, min, max, showTime, shape, size, style, disabled, readOnly, onChange, onClick, onBlur, onClear, tooltip, tTitle, tTrigger, fieldNames ) => {
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
                        disabled={disabled}
                        readOnly={readOnly}
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
                        size={size}
                        allowClear
                        fieldNames={fieldNames}
                        onChange={onChange}
                        onClear={onClear}
                        style={style}    //gotta tell the Select what keys should go in filterOption tag
                        optionFilterProp={[fieldNames?.label??"label", fieldNames?.value??"value"]}
                        showSearch
                        filterOption={
                            (input, option) =>{ //custom filter 
                                const labelKey = fieldNames?.label??"label"
                                const valueKey = fieldNames?.value??"value"
                                
                                const label = option[labelKey].toLowerCase().indexOf(input.toLowerCase()) >= 0
                                const value = option[valueKey].toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    return label || value
                            }
                        }
                        disabled={disabled}
                    />
                );
                break;
            case "Switch":
                item = <Switch size={size} style={style} checkedChildren={shape??<CheckOutlined />} unCheckedChildren={shape??<CloseOutlined />}/>;
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
                        disabledDate={min ?? max}
                        size={size}
                        style={style}
                        onBlur={onBlur}
                        onChange={onChange}
                        format={'ddd DD MMM yyyy'} //donot change yet
                        disabled={disabled}
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
                        disabled={disabled}
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
                        disabledDate={min ?? max}
                        size={size}
                        style={style}
                        onBlur={onBlur}
                        onChange={onChange}
                        format={'ddd DD MMM yyyy'} //donot change yet
                        disabled={disabled}
                    />
                );
                break;
            case "Divider":
                item = <Divider type={mode} style={style} />;
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

export default FormItems;