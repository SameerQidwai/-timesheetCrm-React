import React, { Component } from 'react'
import { Modal, Row, Col, TimePicker, Form, Table } from "antd";
import { LoadingOutlined,InboxOutlined } from "@ant-design/icons";
import TextArea from 'antd/lib/input/TextArea';
import Dragger from 'antd/lib/upload/Dragger';
import { addFiles, getAttachments } from "../../../service/Attachment-Apis";
import { addMilestoneTimesheetNote } from "../../../service/timesheet";
import { dateRange, formatDate, formatFloat } from '../../../service/constant';
import moment from 'moment'
import FormItems from '../../../components/Core/Forms/FormItems';
import '../../styles/table.css'

class BulkModal  extends Component{
    constructor(props){
        super(props)
        this.formRef = React.createRef();

        this.columns = [
            {
              title: 'Date',
              dataIndex: 'date',
              key: 'date',
              render: (text, records) => (
                <Row justify="space-between">
                  <Col> {formatDate(text, true, true)} </Col>
                  {/* <Col style={{ marginLeft: 'auto', color: 'red' }}>
                    {records.disabled}
                  </Col> */}
                </Row>
              ),
            },
            {
              title: 'Start Time',
              dataIndex: 'startTime',
              key: 'startTime',
              render: (text, records, index) => (
                <Form.Item
                  noStyle
                  name={['entry', formatDate(records.date, true, 'DD-MM-YYYY'), 'startTime']}
                >
                  <TimePicker
                    placeholder="Start Time"
                    use12Hours
                    format={"hh:mm a"}
                    bordered={false}
                    minuteStep={15}
                    showNow={false}
                    size="small"
                    onChange={(value) => {
                    //   this.setHours(records, value, index);
                    }}
                  />
                </Form.Item>
              ),
            },
            {
              title: 'End Time',
              dataIndex: 'endTime',
              key: 'endTime',
              render: (text, records, index) => (
                <Form.Item
                  noStyle
                  name={['entry', formatDate(records.date, true, 'DD-MM-YYYY'), 'endTime']}
                >
                  <TimePicker
                    placeholder="End Time"
                    use12Hours
                    format={"hh:mm a"}
                    bordered={false}
                    minuteStep={15}
                    showNow={false}
                    size="small"
                    onChange={(value) => {
                    //   this.setHours(records, value, index);
                    }}
                  />
                </Form.Item>
              ),
            },
            {
              title: 'Break Hours',
              dataIndex: 'breakHours',
              key: 'breakHours',
              render: (text, records, index) => (
                <Form.Item
                  noStyle
                  name={['entry',formatDate(records.date, true, 'DD-MM-YYYY'), 'breakHours']}
                >
                  <TimePicker
                    placeholder="Break Hours"
                    format={"HH:mm"}
                    minuteStep={15}
                    showNow={false}
                    bordered={false}
                    size="small"
                    onChange={(value) => {
                    //   this.setHours(records, value, index);
                    }}
                  />
                </Form.Item>
              ),
            },
            {
              title: 'Hours',
              dataIndex: 'actualHours',
              key: 'actualHours',
            //   render: (text, records, index) => text
            },
        ];

        this.state ={
            loading: false,
            disabled: false,
            BasicFields: [
                {
                  Placeholder: 'Date',
                  rangeMin: true,
                  fieldCol: 6,
                  size: 'small',
                  type: 'Text',
                  itemStyle: { marginBottom: '10px' },
                },
                {
                  object: 'dates',
                  fieldCol: 18,
                  key: 'dateRange',
                  rangeMin: (current) =>{
                    let {monthStart, monthEnd} = props.bulkData
                    return current && !current.isBetween( monthStart, monthEnd, 'day', '[]' )
                  },
                  size: 'small',
                  type: 'RangePicker',
                  rules: [{ required: true, message: 'Dates are Required' }],
                  fieldStyle: { width: '100%' },
                  onChange:(values)=>{
                    const { times } = this.formRef.current.getFieldsValue();
                    this.getDateArray(values[0],values[1], times)
                  }
                },
                {
                  Placeholder: 'Time',
                  fieldCol: 6,
                  size: 'small',
                  type: 'Text',
                  itemStyle: { marginBottom: '10px' },
                },
                {
                    object: "times",
                    fieldCol: 18,
                    // layout: { labelCol: { span: 4 }, wrapperCol: { span: 0 } },
                    key: "timeRange",
                    type: "TimeRange",
                    mode: "use12Hours",
                    rangeMax: false,
                    rangeMin: 15,
                    size: "small",
                    showTime: "hh:mm a",
                    onChange:(values)=>{
                        const { times, dates: {dateRange = []} } = this.formRef.current.getFieldsValue();
                        this.getDateArray(dateRange[0],dateRange[1], times)
                    }
                },
                {
                  Placeholder: 'Break Hours',
                  fieldCol: 6,
                  size: 'small',
                  type: 'Text',
                  itemStyle: { marginBottom: '10px' },
                },
                {
                    object: "times",
                    fieldCol: 18,
                    // labelCol: { span: 4 },
                    key: "breakHours",
                    rangeMin: 15,
                    rangeMax: false,
                    type: "TimePicker",
                    fieldStyle:{width: 'auto'},
                    size: "small",
                    showTime: "HH:mm",
                    onChange:(values)=>{
                        const { times, dates: {dateRange = []} } = this.formRef.current.getFieldsValue();
                        this.getDateArray(dateRange[0],dateRange[1], times)
                    }
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "isweekend",
                    size: "small",
                    label: 'Weekends',
                    initialValue: false,
                    type: "Checkbox",
                    valuePropName: "checked",
                    itemStyle:{margin:'10px 0px'},
                    // name:"reimbursed",
                    // value:"reimbursed"
                    // checked: []
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "iHoliday",
                    label: 'Holidays',
                    size: "small",
                    initialValue: false,
                    type: "Checkbox",
                    valuePropName: "checked",
                    itemStyle:{margin:'10px 0px'},
                    // name:"reimbursed",
                    // value:"reimbursed"
                    // checked: []
                },
            ],
        }
    }
    
    componentDidMount=()=>{
        // const { milestoneEntryId } = this.props.timeObj
        // this.getRecord('PEN', milestoneEntryId[0])
    }

    getRecord = (targetType, targetId) =>{
        const { notes } = this.props.timeObj
        getAttachments(targetType, targetId).then(res=>{
            if(res.success){
                this.setState({
                    fileList: res.fileList,
                    fileIds: res.fileIds,
                    notes: notes
                })
            }
        })
    }

    getTableSummary = (data) => {
        let total = 0;
        data.forEach(({ hours }) => {
          total += parseFloat(hours ?? 0);
        });
    
        return (
          <Table.Summary fixed="top">
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={4}>
                {formatFloat(total)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        );
    };
    
    getDateArray = (start, end, defaultTime ={}, entries) => {
        //try to put your condition to put closer to eachother if they link to eachother
        //so it will be easy to track conditions
        let { holidays, data =[], hoursEntry={} } = this.state;
        let { timeRange: [d_start ,d_end ] = [null, null], breakHours: d_break = 0} = defaultTime
        if (start && end) {
            var arr = new Array();
            while (start.isSameOrBefore(end)) {
                let newDate = start.format('DD-MM-YYYY');
                let duration = ((d_start && d_end) && moment.duration(d_end.diff(d_start)).asHours() )?? 0
                hoursEntry[newDate] = {
                    startTime: d_start,
                    endTime: d_end,
                    breakHours: d_break,
                    actualHours: duration
                }
                arr.push({
                    key: newDate,
                    date: start.format('YYYY-MM-DD'),
                    startTime: d_start,
                    endTime: d_end,
                    breakHours: d_break,
                    actualHours: duration
                });
                start = moment(start).add(1, 'd');
            }
            data= arr
        }else{
            hoursEntry = {};
            data =[]
        }
        console.log(data, hoursEntry)
        this.setState({ data, hoursEntry, });
        this.formRef.current.setFieldsValue({ entry: hoursEntry });
    }

    onSubmit = (values)=>{
        console.log({...this.props.bulkData})
        console.log(values)
    }

    render (){
        const { visible, editTime, loading, close, timeObj } = this.props
        const { BasicFields,data =[] } = this.state;
        const disabled =  false //(timeObj.status === 'SB' || timeObj.status === 'AP') 
        return (
          <Modal
            title={'Bulk Time Entries'}
            maskClosable={false}
            destroyOnClose={true}
            centered
            visible={visible}
            okButtonProps={{
              disabled: loading,
              disabled: disabled,
              htmlType: 'submit',
              form: 'my-form',
            }}
            okText={loading ? <LoadingOutlined /> : 'Submit'}
            onCancel={close}
            width={'85vw'}
            // footer={}
          >
            <Form
              id={'my-form'}
              ref={this.formRef}
              size="small"
              layout="inline"
              onFinish={this.onSubmit}
              // onFinish={this.checkFunc}
            >
              <Row className="moz-width">
                <Col span={10}>
                    <Row>
                        <FormItems FormFields={BasicFields} />
                    </Row>
                </Col>
                <Col span={14}>
                <Table
                    sticky
                    style={{
                      maxHeight: '40vh',
                      overflowY: 'scroll',
                      position: 'relative',
                    }}
                    pagination={false}
                    rowKey={(data) => data.key}
                    columns={this.columns}
                    dataSource={data}
                    on
                    size="small"
                    className='fs-v-small'
                    summary={(data) => {
                      return this.getTableSummary(data);
                    }}
                  />
                </Col>
              </Row>
            </Form>
          </Modal>
        );
    }
}

export default BulkModal 










// COMMNET
/**
 * this.state ={
            loading: false,
            disabled: false,
            BasicFields: [
                {
                  Placeholder: 'Date',
                  rangeMin: true,
                  fieldCol: 6,
                  size: 'small',
                  type: 'Text',
                  itemStyle: { marginBottom: '10px' },
                },
                {
                  object: 'dates',
                  fieldCol: 18,
                  key: 'dateRange',
                  size: 'small',
                  type: 'RangePicker',
                //   rules: [{ required: true, message: 'Start Date is Required' }],
                  fieldStyle: { width: '100%' },
                },
                // {
                //   Placeholder: 'Start Date',
                //   rangeMin: true,
                //   fieldCol: 8,
                //   size: 'small',
                //   type: 'Text',
                //   itemStyle: { marginBottom: '10px' },
                // },
                // {
                //   object: 'dates',
                //   fieldCol: 16,
                //   key: 'startDate',
                //   size: 'small',
                //   type: 'DatePicker',
                //   rules: [{ required: true, message: 'Start Date is Required' }],
                //   fieldStyle: { width: '100%' },
                // //   onChange: (value) => {
                // //     const { dates } = this.formRef.current.getFieldsValue();
                // //     const { startDate, endDate } = dates;
                // //     const { LeaveRequestType } = this.state;
                // //     this.getDateArray(startDate, endDate, LeaveRequestType);
                // //   },
                // //   rangeMin: (current) => {
                // //     const { dates } = this.formRef.current.getFieldsValue();
                // //     const { endDate } = dates;
                // //     return endDate && current > endDate;
                // //   },
                // },
                // {
                //   Placeholder: 'End Date',
                //   fieldCol: 8,
                //   size: 'small',
                //   type: 'Text',
                //   itemStyle: { marginBottom: '10px' },
                // },
                // {
                //   object: 'dates',
                //   fieldCol: 16,
                //   key: 'endDate',
                //   size: 'small',
                //   type: 'DatePicker',
                //   fieldStyle: { width: '100%' },
                // //   disabled: true,
                // //   onChange: (value) => {
                // //     const { dates } = this.formRef.current.getFieldsValue();
                // //     const { endDate, startDate } = dates;
                // //     const { LeaveRequestType } = this.state;
                // //     this.getDateArray(startDate, endDate, LeaveRequestType);
                // //   },
                // //   rangeMax: (current) => {
                // //     const { dates } = this.formRef.current.getFieldsValue();
                // //     const { startDate } = dates;
                // //     return startDate && current < startDate;
                // //   },
                // },
                {
                  Placeholder: 'Time',
                  fieldCol: 6,
                  size: 'small',
                  type: 'Text',
                  itemStyle: { marginBottom: '10px' },
                },
                {
                    object: "obj",
                    fieldCol: 18,
                    // layout: { labelCol: { span: 4 }, wrapperCol: { span: 0 } },
                    key: "timeRange",
                    type: "TimeRange",
                    mode: "use12Hours",
                    rangeMax: false,
                    rangeMin: 15,
                    size: "small",
                    showTime: "hh:mm a",
                },
                // {
                //   Placeholder: 'Start Time',
                //   fieldCol: 6,
                //   size: 'small',
                //   type: 'Text',
                //   itemStyle: { marginBottom: '10px' },
                // },
                // {
                //     object: "obj",
                //     fieldCol: 18,
                //     // layout: { labelCol: { span: 4 }, wrapperCol: { span: 0 } },
                //     key: "startTime",
                //     type: "TimePicker",
                //     mode: "use12Hours",
                //     rangeMax: false,
                //     rangeMin: 15,
                //     size: "small",
                //     showTime: "hh:mm a",
                // },
                // {
                //   Placeholder: 'End Time',
                //   fieldCol: 6,
                //   size: 'small',
                //   type: 'Text',
                //   itemStyle: { marginBottom: '10px' },
                // },
                // {
                //     object: "obj",
                //     fieldCol: 18,
                //     // layout: { labelCol: { span: 4 }, wrapperCol: { span: 0 } },
                //     key: "endTime",
                //     type: "TimePicker",
                //     mode: "use12Hours",
                //     rangeMax: false,
                //     rangeMin: 15,
                //     size: "small",
                //     showTime: "hh:mm a",
                // },
                {
                  Placeholder: 'Break Hours',
                  fieldCol: 6,
                  size: 'small',
                  type: 'Text',
                  itemStyle: { marginBottom: '10px' },
                },
                {
                    object: "obj",
                    fieldCol: 18,
                    // labelCol: { span: 4 },
                    key: "breakHours",
                    rangeMin: 15,
                    rangeMax: false,
                    type: "TimePicker",
                    style:{width: 'auto'},
                    size: "small",
                    showTime: "HH:mm",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "isweekend",
                    size: "small",
                    label: 'Weekends',
                    initialValue: false,
                    type: "Checkbox",
                    valuePropName: "checked",
                    itemStyle:{margin:'10px 0px'},
                    // name:"reimbursed",
                    // value:"reimbursed"
                    // checked: []
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "iHoliday",
                    label: 'Holidays',
                    size: "small",
                    initialValue: false,
                    type: "Checkbox",
                    valuePropName: "checked",
                    itemStyle:{margin:'10px 0px'},
                    // name:"reimbursed",
                    // value:"reimbursed"
                    // checked: []
                },
            ],
        }
 */