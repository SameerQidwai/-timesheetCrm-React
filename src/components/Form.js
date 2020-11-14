import React, { Component } from "react";
import {
    InputNumber,
    Typography,
    DatePicker,
    TimePicker,
    Checkbox,
    Divider,
    Upload,
    Button,
    Select,
    Switch,
    Radio,
    Input,
    Space,
    Form,
    Row,
    Col,
} from "antd";

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
    // console.log("Upload event:");
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

class Forms extends Component {
    constructor(props) {
        super(props);
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
                                            item.fieldStyle,
                                            item.key
                                        )}
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

    filedformat = (
        type,
        placeholder,
        data,
        mode,
        min,
        max,
        defaultValue,
        showTime,
        shape,
        size,
        func,
        style,
        key
    ) => {
        let item = null;
        switch (type) {
            case "Password":
                item = (
                    <Input.Password
                        placeholder={placeholder}
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
                        autoSize={mode}
                        asize={size}
                        style={style}
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
                        style={style}
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
                        onChange={func}
                        style={style}
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
                        size={size}
                        style={style}
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
                    />
                );
                break;
            case "CheckboxGroup":
                item = (
                    <Checkbox.Group options={data} size={size} style={style} />
                );
                break;
            case "Checkbox":
                item = <Checkbox options={data} size={size} style={style} />;
                break;
            case "Title":
                item = (
                    <Title level={mode} size={size} style={style}>
                        {placeholder}
                    </Title>
                );
                break;
            case "Text":
                item = (
                    <Text strong={mode} onClick={func} style={style}>
                        {placeholder}
                    </Text>
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
                        onClick={func}
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
