import React, { Component } from 'react';
import { Modal, Row, Col, TimePicker, Form, Table, Typography, Tooltip } from 'antd';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { formatDate, formatFloat } from '../../../service/constant';
import { getHolidays } from '../../../service/opportunities'; // this need to be change using it here cuz it was already in oppotutinty for profit and loss
import { getCalendarHolidaysFormat, getUserMilestones } from '../../../service/constant-Apis';
import { addBulkTime } from '../../../service/timesheet';
import FormItems from '../../../components/Core/Forms/FormItems';
import moment from 'moment';
import '../../styles/table.css';


class BulkModal extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    let { monthStart, monthEnd } = props.bulkData;
    this.dateFormat = 'DD-MM-YYYY';
    this.dateKeyFormat = 'YYYY-MM-DD';
    this.columns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        width: '22%',
        render: (text, records) => (
          <Row justify="space-between">
            <Col> {formatDate(records.key, true, true)} </Col>
            <Col>
              <Tooltip
                title={
                  records.holiday !== 'Weekend'
                    ? records.leaveApplied ?? records.holiday
                    : ''
                }
              >
                <Typography.Text style={{ color: 'red', fontSize: 10 }}>
                  {records.holiday}
                </Typography.Text>
              </Tooltip>
            </Col>
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
              formatDate(records.key, true, this.dateFormat),
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
                this.setHours(
                  formatDate(records.key, true, this.dateFormat),
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
              formatDate(records.key, true, this.dateFormat),
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
                this.setHours(
                  formatDate(records.key, true, this.dateFormat),
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
              formatDate(records.key, true, this.dateFormat),
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
                this.setHours(
                  formatDate(records.key, true, this.dateFormat),
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

    this.state = {
      loading: false,
      disabled: false,
      holidays: [],
      leaveDays: [],
      BasicFields: [
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
          itemStyle: {marginBottom:5},
          data: [],
          type: 'Select',
          onChange: (value) => {
            this.projectLeaveRequest(value);
          },
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
          rangeMin: (current) => {
            return (
              current && !current.isBetween(monthStart, monthEnd, 'day', '[]')
            );
          },
          size: 'small',
          type: 'RangePicker',
          rules: [{ required: true, message: 'Dates Are Required' }],
          itemStyle: {marginBottom:10},
          fieldStyle: { width: '100%' },
          ranges: {
            'This Month': [monthStart, monthEnd],
          },
          onChange: (values = []) => {
            const {
              times,
              dates: { dateRange = [] },
              include,
            } = this.formRef.current.getFieldsValue();
            values = values || [];
            this.getDateArray(values[0], values[1], times);
          },
        },
        {
          Placeholder: 'Time',
          fieldCol: 6,
          size: 'small',
          type: 'Text',
          itemStyle: { marginBottom: '10px' },
        },
        {
          object: 'times',
          fieldCol: 18,
          // layout: { labelCol: { span: 4 }, wrapperCol: { span: 0 } },
          key: 'timeRange',
          type: 'TimeRange',
          mode: 'use12Hours',
          orderCheck: false,
          rangeMax: false,
          rangeMin: 15,
          size: 'small',
          showTime: 'hh:mm a',
          onChange: (values) => {
            let {
              times,
              dates: { dateRange = [] },
              include,
            } = this.formRef.current.getFieldsValue();
            dateRange = dateRange || [];
            this.getDateArray(dateRange[0], dateRange[1], times);
          },
        },
        {
          Placeholder: 'Break Hours',
          fieldCol: 6,
          size: 'small',
          type: 'Text',
          itemStyle: { marginBottom: '10px' },
        },
        {
          object: 'times',
          fieldCol: 18,
          // labelCol: { span: 4 },
          key: 'breakHours',
          rangeMin: 15,
          rangeMax: false,
          type: 'TimePicker',
          fieldStyle: { width: 'auto' },
          size: 'small',
          showTime: 'HH:mm',
          onChange: (values) => {
            let {
              times,
              dates: { dateRange = [] },
              include,
            } = this.formRef.current.getFieldsValue();
            dateRange = dateRange || [];
            this.getDateArray(dateRange[0], dateRange[1], times);
          },
        },
        {
          fieldCol: 24,
          size: 'small',
          Placeholder: 'Include',
          type: 'Title',
          fieldStyle: { marginTop: '5px' },
          mode: 5,
        },
        {
          object: 'includes',
          fieldCol: 24,
          key: 'isWeekend',
          size: 'small',
          label: 'Weekends',
          initialValue: false,
          type: 'Checkbox',
          valuePropName: 'checked',
          itemStyle: { margin: '5px 10px' },
          onChange: (values) => {
            let {
              times,
              dates: { dateRange = [] },
              include,
            } = this.formRef.current.getFieldsValue();
            dateRange = dateRange || [];
            this.getDateArray(dateRange[0], dateRange[1], times);
          },
        },
        {
          object: 'includes',
          fieldCol: 24,
          key: 'isHoliday',
          label: 'Holidays',
          size: 'small',
          initialValue: false,
          type: 'Checkbox',
          valuePropName: 'checked',
          itemStyle: { margin: '5px 10px' },
          onChange: (values) => {
            let {
              times,
              dates: { dateRange = [] },
              include,
            } = this.formRef.current.getFieldsValue();
            dateRange = dateRange || [];
            this.getDateArray(dateRange[0], dateRange[1], times);
          },
        },
        {
          object: 'includes',
          fieldCol: 24,
          key: 'isLeave',
          label: 'Leave Applied Days',
          size: 'small',
          initialValue: false,
          type: 'Checkbox',
          valuePropName: 'checked',
          itemStyle: { margin: '5px 10px' },
          onChange: (values) => {
            let {
              times,
              dates: { dateRange = [] },
              include,
            } = this.formRef.current.getFieldsValue();
            dateRange = dateRange || [];
            this.getDateArray(dateRange[0], dateRange[1], times);
          },
        },
      ],
    };
  }

  componentDidMount = () => {
    this.getProjects();
    this.fetchHolidays();
    this.projectLeaveRequest();
  };

  getTableSummary = (data) => {
    let total = 0;
    data.forEach(({ actualHours }) => {
      total += parseFloat(actualHours ?? 0);
    });

    return (
      <Table.Summary fixed="top">
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="right">
            Total
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2} align="center">
            {formatFloat(total)}
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  getDateArray = () => {
    //try to put your condition to put closer to eachother if they link to eachother
    let { holidays, data = [], hoursEntry = {}, leaveDays } = this.state;
    //so it will be easy to track conditions
    const {
      times: defaultTime,
      dates: { dateRange = [] },
      includes: { isWeekend, isHoliday, isLeave },
    } = this.formRef.current.getFieldsValue();
    //get data from form
    let [start = null, end = null] = dateRange || [];
    let { timeRange, breakHours: d_break = 0 } = defaultTime;
    let [d_start = null, d_end = null] = timeRange || [];
    //initilizing form data into varialbles

    let duration = this.calculationDuration(d_start, d_end);
    let breakAsHours =
      d_break && moment.duration(d_break.format('HH:mm')).asHours();
    if (start && end) {
      var arr = new Array();

      while (start.isSameOrBefore(end)) {
        const newDate = start.format(this.dateFormat);
        let dateKey = start.format(this.dateKeyFormat);
        hoursEntry[newDate] = {
          startTime: d_start,
          endTime: d_end,
          breakHours: d_break,
          actualHours: formatFloat(duration - breakAsHours),
        };

        if (start.isoWeekday() > 5) { // add weekend label 
          hoursEntry[newDate] = {
            ...hoursEntry[newDate],
            holiday: 'Weekend',
          };
          if (!isWeekend) { // remove entries
            hoursEntry[newDate] = {
              holiday: 'Weekend',
            };
          }
        }

        if (holidays[dateKey]) { // add holiday label
          hoursEntry[newDate] = {
            ...hoursEntry[newDate],
            holiday: holidays[dateKey],
          };
          if (!isHoliday) { // remove entries
            hoursEntry[newDate] = {
              holiday: holidays[dateKey],
            };
          }
        }

        if (leaveDays[dateKey]) { // add leave label 
          let { hours, leaveType } = leaveDays[dateKey];
          hoursEntry[newDate] = {
            ...hoursEntry[newDate],
            holiday: `Leave Applied - ${hours} hrs`,
            leaveApplied: `${leaveType}`,
          };
          if (!isLeave) { // remove entries
            hoursEntry[newDate] = {
              holiday: `Leave Applied - ${hours} hrs`,
            leaveApplied: `${leaveType}`,
            };
          }
        }

        arr.push({
          key: dateKey,
          date: newDate,
          ...hoursEntry[newDate],
        });
        start = moment(start).add(1, 'd');
      }

      data = arr;
    } else {
      hoursEntry = {};
      data = [];
    }
    this.setState({ data, hoursEntry });
    this.formRef.current.setFieldsValue({ entry: { ...hoursEntry } });
  };

  projectLeaveRequest = (milestoneId) => {
    const { leaves = [] } = this.props?.bulkData;
    let leaveDays = {};
    for (const leave of leaves) {
      if (leave.workId === milestoneId || !leave.workId) {
        let leaveType = `${leave['leaveType']}`;
        for (const key in leave) {
          if (moment(key, 'D/M', true).isValid()) {
            let dateKey = moment(leave[key].date, 'D-M-YYYY').format(
              this.dateKeyFormat
            );
            leaveDays[dateKey] = { hours: leave[key].hours, leaveType };
          }
        }
      }
    }
    this.setState({ leaveDays: { ...leaveDays } }, () => {
      this.getDateArray();
    });
  };

  getProjects = () => {
    let { BasicFields } = this.state;
    const { userId, monthStart, monthEnd } = this.props?.bulkData;
    getUserMilestones({
      userId: userId,
      phase: 0,
      startDate: monthStart.format(this.dateFormat),
      endDate: monthEnd.format(this.dateFormat),
    }).then((res) => {
      if (res.success) {
        BasicFields[1].data = res.data;
        this.setState({
          BasicFields,
        });
      }
    });
  };

  fetchHolidays = () => {
    getCalendarHolidaysFormat().then((res) => {
      if (res.success) {
        this.setState({ holidays: res.data });
      }
    });
  };

  setHours = (dateKey, index) => {
    let { hoursEntry, data } = this.state;
    let entry = this.formRef.current.getFieldValue(['entry', dateKey]);
    let { startTime, endTime, breakHours } = entry;
    let duration = this.calculationDuration(startTime, endTime);
    let breakAsHours = breakHours
      ? moment.duration(breakHours.format('HH:mm')).asHours()
      : 0;
    entry['actualHours'] = formatFloat(duration - breakAsHours);
    hoursEntry[dateKey] = entry;
    data[index] = { ...data[index], ...entry };
    this.setState({ hoursEntry: { ...hoursEntry }, data: [...data] });
  };

  calculationDuration = (start, end) => {
    if (start && end) {
      if (
        moment
          .duration(
            moment(end.format('hh:mm a'), 'hh:mm a').diff(
              moment(start.format('hh:mm a'), 'hh:mm a')
            )
          )
          .asHours() < 0
      ) {
        return Math.abs(
          moment
            .duration(
              moment(end, 'HH:mm')
                .add(1, 'days')
                .diff(moment(start.format('hh:mm a'), 'hh:mm a'))
            )
            .asHours()
        );
      } else {
        return Math.abs(
          moment
            .duration(
              moment(end.format('hh:mm a'), 'hh:mm a').diff(
                moment(start.format('hh:mm a'), 'hh:mm a')
              )
            )
            .asHours()
        );
      }
    } else {
      return 0;
    }
  };

  onSubmit = (values) => {
    const {
      dates: {
        dateRange: [startDate = null, endDate = null],
        workId,
      },
      includes: { isHoliday = false, isWeekend = false },
    } = values;
    let {
      bulkData: { monthStart, monthEnd, userId },
      callBack,
    } = this.props;
    let { data } = this.state;
    let keys = {
      monthStart: monthStart.format(this.dateFormat),
      monthEnd: monthEnd.format(this.dateFormat),
      userId: userId,
    };

    let submitObject = {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      holidays: isHoliday,
      weekends: isWeekend,
      milestoneId: workId,
      entries: data.reduce((acc, { date, startTime, endTime, breakHours }) => {
        if (startTime && endTime) {
          acc.push({
            date,
            startTime: startTime.format('HH:mm'),
            endTime: endTime.format('HH:mm'),
            breakHours: breakHours
              ? moment.duration(breakHours.format('HH:mm')).asHours()
              : 0,
          });
        }
        return acc;
      }, []),
    };
    addBulkTime(keys, submitObject).then((res) => {
      if (res.success) {
        callBack();
      }else{
        this.setState({loading: false})
      }
    });
  };

  onConfirm = async() => {
    try{
      const values = await this.formRef.current.validateFields();
      
      let modal = Modal.confirm({
        title: `Do you wish to proceed?`,
        icon: <ExclamationCircleOutlined />,
        content: `You are about to apply a bulk timesheet data entry. Any existing timesheet entries for the project and dates already entered will be overwritten.`,
        // okButtonProps: { danger: stage === 'Delete' ?? true },
        okButtonProps: {
          htmlType: 'submit',
          form: 'my-form',
        },
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => {
          modal.destroy();
        },
        onCancel: () => {
          this.setState({ loading: false }, () => {
            modal.destroy();
          });
        },
      });

    }catch{
      this.setState({ loading: false });
    }
  };

  render() {
    const { visible, close } = this.props;
    const { BasicFields, data = [], loading = false } = this.state;
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
        onOk={() => {
          this.setState({ loading: true }, () => {
            this.onConfirm();
          });
        }}
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
                  height: '60vh',
                  overflowY: 'scroll',
                  position: 'relative',
                }}
                pagination={false}
                rowKey={(data) => data.key}
                columns={this.columns}
                dataSource={data}
                on
                size="small"
                className="fs-v-small"
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

export default BulkModal;
