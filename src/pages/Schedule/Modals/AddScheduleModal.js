import React, { Component } from 'react';
import { Modal, Table, Form, Row, Col, Upload, Typography, Input, InputNumber, message, } from 'antd';
import { PlusOutlined } from '@ant-design/icons'; //Icons
import FormItems, { formatter, parser } from '../../../components/Core/Forms/FormItems';
import { addFiles } from '../../../service/Attachment-Apis';
import {
  getUserProjects,
  getUserLeaveType,
} from '../../../service/constant-Apis';
import {
  addRequest,
  editRequest,
  getSingleRequest,
} from '../../../service/leaveRequest-Apis';
import moment from 'moment';
import { dateRange, formatCurrency, formatDate, formatFloat, localStore } from '../../../service/constant';

import '../styles.css';
import { addSchedule, editSchedule, getSchedule } from '../../../service/projects';

const { Text } = Typography;

class AddScheduleModal extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.attachRef = React.createRef();

    this.state = {
      data: [],
      amountEntry: {}, //need to remeber hours if date is change for now it is setting it to defualt if any date selected
      loading: false,
      disabled: false,
      BasicFields: [
        {
          Placeholder: 'Start Date',
          rangeMin: true,
          fieldCol: 8,
          size: 'small',
          type: 'Text',
          labelAlign: 'right',
          itemStyle: { marginBottom: '10px' },
        },
        {
          object: 'dates',
          fieldCol: 16,
          key: 'startDate',
          size: 'small',
          mode: 'month',
          type: 'DatePicker',
          rules: [{ required: true, message: 'Start Date is Required' }],
          onChange: (value) => {
            const { dates } = this.formRef.current.getFieldsValue();
            const { startDate, endDate } = dates;
            this.formRef.current.setFieldsValue({
              dates: { ...dates, endDate: null, startDate: value && startDate.startOf('month') },
            });
            this.getDateArray(startDate);
          },
          rangeMin: (current) => {
            const {dates} = this.formRef.current.getFieldsValue();
            const { endDate } = dates;
            return dateRange(current, endDate, 'start', props.pDates)
          },
        },
        {
          Placeholder: 'End Date',
          fieldCol: 8,
          size: 'small',
          type: 'Text',
          labelAlign: 'right',
          itemStyle: { marginBottom: '10px' },
        },
        {
          object: 'dates',
          fieldCol: 16,
          key: 'endDate',
          size: 'small',
          mode: 'month',
          type: 'DatePicker',
          disabled: true,
          onChange: (value) => {
            const { dates } = this.formRef.current.getFieldValue();
            const { endDate, startDate } = dates;
            if (value){
              this.formRef.current.setFieldsValue({
                dates: { ...dates, endDate: endDate.endOf('month') },
              });
            }
            this.getDateArray(startDate, endDate);
          },
          rangeMax: (current) => {
            const {dates} = this.formRef.current.getFieldValue();
            const {startDate} = dates
            return dateRange(current, moment(startDate), 'end', props.pDates)
          },
        },
        {
          Placeholder: 'Amount',
          rangeMin: true,
          fieldCol: 8,
          size: 'small',
          type: 'Text',
          labelAlign: 'right',
          itemStyle: { marginBottom: '10px' },
        },
        {
          object: 'dates',
          fieldCol: 16,
          key: 'amount',
          size: 'small',
          type: "InputNumber",
          rangeMin: 0,
          rangeMax: props.accountedAmount(),
          shape: '$',
          rules: [{ required: true, message: 'Amount is Required' }],
          disabled: false,
          onBlur: ()=>{
            const { dates ={} } = this.formRef.current.getFieldValue();
            const { endDate, startDate } = dates;
            this.getDateArray(startDate, endDate)
          }
        },
        {
          Placeholder: 'Description',
          fieldCol: 8,
          size: 'small',
          type: 'Text',
          labelAlign: 'right',
          itemStyle: { marginBottom: '10px' },
        },
        {
          object: 'dates',
          fieldCol: 24,
          key: 'notes',
          size: 'small',
          type: 'Textarea',
          mode: { minRows: 2, maxRows: 3 },
          fieldStyle: { height: '10vh' },
        },
      ],
    };
  }
  componentDidMount = () => {
    console.log(this.props.accountedAmount())
    const { editMile } = this.props;
    if (editMile) {
      this.getSubmittedData();
    }
  };

  setHours = (record, value, index) => {
    const { data, amountEntry } = this.state;
    
    data[index].amount = value;
    amountEntry[record.key] = value;
    this.setState({
      data: [...data],
      amountEntry: { ...amountEntry },
    });
  };

  // this function is a mess right now need some fixes so it will be readable
  getDateArray = (start, end, entries) => {
    //try to put your condition to put closer to eachother if they link to eachother
    //so it will be easy to track conditions
    let { BasicFields, data, amountEntry } = this.state;
    BasicFields[3].disabled = false;
    let { dates } = this.formRef.current.getFieldValue()
    if (entries) {
      var arr = new Array();
      data = entries.map((el) => {
        // var { startDate, amount } = el; // in this conditon this hours value will be replace
        let newDate = moment(el.startDate).format('MMM-YYYY');

        amountEntry[newDate]  = `${el.amount}`; // setting the hours object before return
        return {
          key: newDate,
          month: newDate,
          amount: amountEntry[newDate],
        };
      });
      // BasicFields[BasicFields[2].note ? 8 : 7].disabled = readOnly; // adding an object when select leavetype
      // and disabling endDate
    } else if (start && end) {
      //it will call on change of start and end date and found
      var arr = new Array();
      //dividing equal amount to segments
      let numberofSegments = moment(end.endOf('month')).diff(start.startOf('month'), 'months')+1;
      let perSegmentAmount = parseFloat(formatFloat(dates.amount/numberofSegments))

      while (start.isSameOrBefore(end)) {
        // need key to push in the table
        //hours are getting update on each call
        let newDate = start.format('MMM-YYYY'); // newDate  = date for the new row
        // to set it in form for date
        amountEntry[newDate]  = perSegmentAmount
        arr.push({
          key: newDate,
          month: newDate,
          amount: amountEntry[newDate],
        });
        start = moment(start).add(1, 'M');
      }
      data = arr;
      // BasicFields[BasicFields[2].note ? 8 : 7].disabled = false; // adding an object when select leavetype
    } else if (start) {
      //if end date is not sent
      let newDate = start.format('MMM-YYYY');
      amountEntry[newDate]  = dates.amount
      data = [
        {
          key: newDate,
          month: newDate,
          amount: amountEntry[newDate],
        },
      ];
    } else {
      this.formRef.current.setFieldsValue({
        dates: { startDate: null, endDate: null },
      });
      BasicFields[3].disabled = true; // adding an object when select leavetype
      amountEntry = {};
      data = [];
    }


    this.setState({
      BasicFields: [...BasicFields],
      data: [...data],
      amountEntry: {...amountEntry}
    });
    this.formRef.current.setFieldsValue({ amount: amountEntry });
    //single hook cal for all the condition
  };

  getSubmittedData = () => {
    // Get Projects
    const {proId, editMile} = this.props
    getSchedule(proId, editMile.id)
      .then((res) => {
        //Destructure res[1] to avoid writing res[1] repeateadly
        if (res?.success) {
          const {id, notes, amount, startDate, endDate, segments = []} = res.data
          // run if modal is opened for editing
          const formValues = {
            id: id,
            notes: notes,
            amount: amount,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          };
          this.getDateArray(
            formValues.startDate,
            formValues.endDate,
            segments
          );
          this.formRef.current.setFieldsValue({ dates: formValues });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  getFormValues = (val) => {
    this.setState({ loading: true });
    const { dates } = val;
    const { editMile, callBack, proId } = this.props;
    const { data, fileIds } = this.state;
    const newVal = {
      startDate: formatDate(dates.startDate, true),
      endDate: dates.endDate ?? formatDate(dates.startDate?.endOf('month')),
      amount: dates.amount,
      notes: dates.notes ?? '',
      segments: data.map(el=>{
        return {
          startDate: formatDate(moment(el.month, 'MMM/YYYY').startOf('month'), true),
          endDate: formatDate(moment(el.month, 'MMM/YYYY').endOf('month'), true),
          amount: el.amount
        }
      }),
    };
    if (editMile) {
      editSchedule(proId, editMile.id, newVal).then((res) => {
        this.setState({ loading: false });
        if (res.success) {
          callBack(res.data);
        }
      });
    } else {
      // console.log('newVal: ', newVal)
      addSchedule(proId, newVal).then((res) => {
        this.setState({ loading: false });
        if (res.success) {
          callBack(res.data);
        }
      });
    }
  };

  getTableSummary = (data) => {
    let total = 0;
    let exceedAmount = ''
    const {dates={}} = this.formRef?.current?.getFieldValue() ?? {};
    data.forEach(({ amount }) => {
      total += parseFloat(amount ?? 0);
    });

    if ((dates.amount?? 0) < total){
      exceedAmount = 'danger'
    }

    return (
      <Table.Summary fixed="top">
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>
            Total
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1} >
          <Text type={exceedAmount}>{formatCurrency(total)}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  accountedSegAmount = () =>{
    const {dates, amount} = this.formRef.current.getFieldValue();
    if (dates && amount){
      console.log(dates, amount)
    }
    // let schedualAmount = dates.amount

  }

  //File
  render() {
    const { visible, close, editMile, onHold } = this.props;
    const { BasicFields, data, loading, disabled } = this.state;
    
    // for timeBeing
    let columns = [
      {
        title: 'Month',
        dataIndex: 'month',
        key: 'month',
        render: (text, records) => (
          <Row justify="space-between">
            <Col> {text} </Col>
          </Row>
        ),
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (text, records, index) => (
          <Form.Item
            noStyle
            name={['amount', records.key]}
          >
            <InputNumber
              min={0}
              placeholder="amount"
              formatter={(value) => formatter(value, '$') }
              parser={(value) => parser(value, '$') }
              // max={()=>this.accountedSegAmount()}
              style={{width: '100%'}}
              size="small"
              disabled={records.disabled}
              onChange={(value) => {
                this.setHours(records, value, index);
              }}
            />
          </Form.Item>
        ),
      },
    ];

    // For time bring
    return (
      <Modal
        title={ editMile ? 'Edit Schedule' : 'New Schedule' }
        maskClosable
        destroyOnClose={true}
        visible={visible}
        okButtonProps={{
          htmlType: 'submit',
          form: 'my-form',
          disabled: onHold || disabled,
          loading: loading,
        }}
        okText={'Submit'}
        onCancel={() => {
          message.destroy();
          close();
        }}
        width={1000}
      >
        <Form
          id={'my-form'}
          ref={this.formRef}
          size="small"
          layout="inline"
          onFinish={this.getFormValues}
        >
          <Row className="moz-width">
            <Col span={12}>
              <Row>
                <FormItems FormFields={BasicFields} />
              </Row>
            </Col>
            <Col span={12}>
              <Table
                sticky
                style={{
                  maxHeight: '40vh',
                  overflowY: 'scroll',
                  position: 'relative',
                }}
                pagination={false}
                rowKey={(data) => data.key}
                columns={columns}
                dataSource={data}
                size="small"
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

export default AddScheduleModal;
