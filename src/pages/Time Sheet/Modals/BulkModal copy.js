import React, { useState, useEffect } from 'react'
import { Modal, Row, Col, TimePicker, Form, Table } from "antd";
import { LoadingOutlined,ExclamationCircleOutlined } from "@ant-design/icons";
import { formatDate, formatFloat } from '../../../service/constant';
import { getHolidays } from "../../../service/opportunities"; // this need to be change using it here cuz it was already in oppotutinty for profit and loss
import moment from 'moment'
import FormItems from '../../../components/Core/Forms/FormItems';
import '../../styles/table.css'
import { getUserMilestones } from '../../../service/constant-Apis';
import { addBulkTime } from '../../../service/timesheet';

const BulkModal = ({visible, bulkData:{monthStart, monthEnd, userId}, callBack, close}) =>{
        const [loading, setLoading] = useState(false)
        const [holidays, setHolidays] = useState({})
        const [data, setData] = useState({entries: [], hoursEntry: {}})
        const [BasicFields, setBasicFields] = useState([
          {
              Placeholder: 'Project',
              fieldCol: 6,
              rangeMin: true, 
              size: 'small',
              type: 'Text',
              labelAlign: 'right',
              itemStyle: { marginBottom: '10px' },
          },
          {
              object: 'dates',
              fieldCol: 18,
              key: 'workId',
              size: 'small',
              rules: [{ required: true, message: 'Project Is Required' }],
              data: [],
              type: 'Select',
          },
          {
            Placeholder: 'Dates',
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
              return current && !current.isBetween( monthStart, monthEnd, 'day', '[]' )
            },
            size: 'small',
            type: 'RangePicker',
            rules: [{ required: true, message: 'Dates Are Required' }],
            fieldStyle: { width: '100%' },
            ranges: {
              'This Month': [monthStart, monthEnd],
            },
            onChange:()=>getDateArray()
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
              orderCheck: false,
              rangeMax: false,
              rangeMin: 15,
              size: "small",
              showTime: "hh:mm a",
              onChange:()=> getDateArray() 
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
              onChange:()=> getDateArray()
          },
          {
              object: "includes",
              fieldCol: 12,
              key: "isWeekend",
              size: "small",
              label: 'Weekends',
              initialValue: false,
              type: "Checkbox",
              valuePropName: "checked",
              itemStyle:{margin:'10px 0px'},
              onChange:()=> getDateArray()
          },
          {
              object: "includes",
              fieldCol: 12,
              key: "isHoliday",
              label: 'Holidays',
              size: "small",
              initialValue: false,
              type: "Checkbox",
              valuePropName: "checked",
              itemStyle:{margin:'10px 0px'},
              onChange:()=> getDateArray()
          },
      ],)
        const columns = [
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text, records) => (
              <Row justify="space-between">
                <Col> {formatDate(records.key, true, true)} </Col>
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
                name={[
                  'entry',
                  formatDate(records.key, true, 'DD-MM-YYYY'),
                  'startTime',
                ]}
              >
                <TimePicker
                  placeholder="Start Time"
                  use12Hours
                  format={'hh:mm a'}
                  bordered={false}
                  minuteStep={15}
                  showNow={false}
                  size="small"
                  onChange={(value) => {
                    setHours(
                      formatDate(records.key, true, 'DD-MM-YYYY'),
                      index
                    );
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
                name={[
                  'entry',
                  formatDate(records.key, true, 'DD-MM-YYYY'),
                  'endTime',
                ]}
              >
                <TimePicker
                  placeholder="End Time"
                  use12Hours
                  format={'hh:mm a'}
                  bordered={false}
                  minuteStep={15}
                  showNow={false}
                  size="small"
                  onChange={(value) => {
                    setHours(
                      formatDate(records.key, true, 'DD-MM-YYYY'),
                      index
                    );
                  }}
                />
              </Form.Item>
            ),
          },
          {
            title: 'Break',
            dataIndex: 'breakHours',
            key: 'breakHours',
            render: (text, records, index) => (
              <Form.Item
                noStyle
                name={[
                  'entry',
                  formatDate(records.key, true, 'DD-MM-YYYY'),
                  'breakHours',
                ]}
              >
                <TimePicker
                  placeholder="Break"
                  format={'HH:mm'}
                  minuteStep={15}
                  showNow={false}
                  bordered={false}
                  size="small"
                  onChange={(value) => {
                    setHours(
                      formatDate(records.key, true, 'DD-MM-YYYY'),
                      index
                    );
                  }}
                />
              </Form.Item>
            ),
          },
          {
            title: 'Daily Hours',
            dataIndex: 'actualHours',
            key: 'actualHours',
            align: 'center',
            //   render: (text, records, index) => text
          },
        ];
        const [form] = Form.useForm();

        useEffect(() => {
          getProjects()
          fetchHolidays()
        }, [])

        const getProjects = () => {
          let dummyFields = [...BasicFields]
          getUserMilestones({
          userId: userId,
          phase: 0,
          startDate: monthStart.format('DD-MM-YYYY'),
          endDate: monthEnd.format('DD-MM-YYYY'),
          }).then((res) => {
            if (res.success) {
            dummyFields[1].data =res.data
              setBasicFields(dummyFields)
            }
          });
      };
  
      const fetchHolidays = (id=0) =>{
        getHolidays(id).then(res=>{
          if(res.success){
            const { holidays } = res.data
            let holidaysObj = {}
            for (const date of holidays) {
                holidaysObj[date] = true
            }
            setHolidays(holidaysObj)
          }
        })
      }
        
    
    
    const getDateArray = () => {
        //try to put your condition to put closer to eachother if they link to eachother
        let tempArr = new Array();
        let tempEntry={}
        //so it will be easy to track conditions
        const { times: defaultTime, dates: {dateRange = []}, includes: {isWeekend, isHoliday} } = form.getFieldsValue();
        //get data from form 
        let [start = null, end = null] = dateRange || [];
        let {timeRange, breakHours: d_break = 0} = defaultTime
        let [d_start = null, d_end = null] = timeRange || []
        //initilizing form data into varialbles

        // had to format and re-format is becuase of changing in some nano second was making a lil diffenert in millisecond
        let duration = ((d_start && d_end) && Math.abs(moment.duration(moment(d_end.format('hh:mm a'), 'hh:mm a').diff(moment(d_start.format('hh:mm a'), 'hh:mm a'))).asHours()))?? 0 ;
        let breakAsHours = d_break && moment.duration(d_break.format('HH:mm')).asHours()
        if (start && end) {
          
          while (start.isSameOrBefore(end)) {
                const newDate = start.format('DD-MM-YYYY');
                tempEntry[newDate]  = {
                    startTime: d_start,
                    endTime: d_end,
                    breakHours: d_break,
                    actualHours: formatFloat(duration - breakAsHours)
                }
                if (!isWeekend&& start.isoWeekday() > 5) {
                  tempEntry[newDate] = {}
                }
                if(!isHoliday && holidays[start.format('M D YYYY')]){
                  console.log(start.format('M D YYYY'))
                  tempEntry[newDate] = {}
                }
               
                
                tempArr.push({
                    key: start.format('YYYY-MM-DD'),
                    date: newDate,
                    ...(tempEntry[newDate])
                });
                start = moment(start).add(1, 'd');
            }
        }
        setData({entries: [...tempArr], hoursEntry: {...tempEntry}})
        form.setFieldsValue({ entry: {...tempEntry} });
    }

   

    const setHours = (dateKey, index) =>{
      let {hoursEntry: tempEntry, entries: tempArr} = data
      let entry = form.getFieldValue(['entry', dateKey]);
      let {startTime, endTime, breakHours} = entry 
      let duration = ((startTime && endTime) && Math.abs(moment.duration(moment(startTime.format('hh:mm a'), 'hh:mm a').diff(moment(endTime.format('hh:mm a'), 'hh:mm a'))).asHours()))?? 0 ;
      let breakAsHours = breakHours && moment.duration(breakHours.format('HH:mm')).asHours()
      entry['actualHours'] = formatFloat(duration - breakAsHours)
      tempEntry[dateKey] = entry
      tempArr[index] = {...tempArr[index], ...entry}
      setData({hoursEntry: {...tempEntry}, entries: [...tempArr]})
    }

    const getTableSummary = (data) => {
      let total = 0;
      data.forEach(({ actualHours }) => {
        total += parseFloat(actualHours ?? 0);
      });
  
      return (
        <Table.Summary fixed="top">
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}  colSpan={3}></Table.Summary.Cell>
            <Table.Summary.Cell index={1} align='right'>Total</Table.Summary.Cell>
            <Table.Summary.Cell index={2} align='center'>
              {formatFloat(total)}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      );
  };

    const onSubmit = (values)=>{
        const {dates: {dateRange: [startDate = null, endDate= null], workId}, includes: {isHoliday=false, isWeekend=false}} = values
        let keys = { monthStart: monthStart.format('DD-MM-YYYY'), monthEnd: monthEnd.format('DD-MM-YYYY'), userId: userId } 

        let submitObject = {
          startDate,
          endDate,
          holidays: isHoliday,
          weekends: isWeekend,
          milestoneId: workId,
          entries: data.reduce((acc, {date,
            startTime,
            endTime,
            breakHours,})=>{
              if(startTime && endTime){
                acc.push({
                date,
                startTime: startTime.format('HH:mm'),
                endTime: endTime.format('HH:mm'),
                breakHours: breakHours ? 
                  moment.duration(breakHours.format('HH:mm')).asHours()
                : 0
              })
          }
          return acc;
        }, [])
        }
        addBulkTime(keys, submitObject).then(res=>{
          if(res.success){
            setLoading(false)
            callBack()
          }
        })
    }

    const onConfirm = () =>{
      let modal = Modal.confirm({
        title: `Do you wish to proceed?`,
        icon: <ExclamationCircleOutlined />,
        content: `You are about to apply a bulk timesheet data entry. Any existing timesheet entries for the project and dates already entered will be overwritten.`,
        // okButtonProps: { danger: stage === 'Delete' ?? true },
        okButtonProps:{
          htmlType: 'submit',
          form: 'my-form',
        },
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => {
          modal.destroy();
        },
        onCancel: () => {
          setLoading(true)
          modal.destroy();
        }
      });
    }
        return (
          <Modal
            title={'Bulk Time Entries'}
            maskClosable={false}
            destroyOnClose={true}
            centered
            visible={visible}
            okButtonProps={{
              disabled: loading,
            }}
            okText={loading ? <LoadingOutlined /> : 'Save'}
            onCancel={close}
            onOk={ () => {
              setLoading(true)
              this.onConfirm()
            }}
            width={'85vw'}
            // footer={}
          >
            <Form
              id={'my-form'}
              form={form}
              size="small"
              layout="inline"
              onFinish={onSubmit}
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
                      height: '60vh',
                      overflowY: 'scroll',
                      position: 'relative',
                    }}
                    pagination={false}
                    rowKey={(data) => data.key}
                    columns={columns}
                    dataSource={(data?.entries?? [])}
                    on
                    size="small"
                    className='fs-v-small'
                    summary={getTableSummary}
                  />
                </Col>
              </Row>
            </Form>
          </Modal>
        );
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