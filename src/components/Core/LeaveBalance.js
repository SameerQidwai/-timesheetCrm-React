import React, { Component, useContext, useState, useEffect, useRef } from 'react';
import { Table, Row, Col, Form, Popconfirm, InputNumber } from 'antd'
import { CloseSquareFilled, CheckSquareFilled } from "@ant-design/icons"; //Icons
import { formatFloat } from '../../service/constant';
import { getLeaveBalance } from '../../service/leaveRequest-Apis';

import '../Styles/table.css'

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
    <Row>
      <Col span={10}>
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <InputNumber 
            ref={inputRef} 
            size='small' 
            onBlur={()=> setTimeout(() => { setEditing(!editing) }, 300)} 
          />
        </Form.Item>
      </Col>
      <Col style={{margin: 'auto 0'}} span={3}>
        <CloseSquareFilled style={{color: 'red', fontSize: 24}} onClick={()=>setEditing(!editing)}/>
      </Col>
      <Col style={{margin: 'auto 0'}}>
        <CheckSquareFilled style={{color: 'green', fontSize: 24}} onClick={save} />
      </Col>
      </Row>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

class LeaveBalance extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Type',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Accured',
                dataIndex: 'carryForward',
                key: 'carryForward',
                className: 'editable-cell',
                width: 275,
                editable: true,
                render:(text) => formatFloat(text)
            },
            {
                title: 'Earned YTD',
                dataIndex: 'earned',
                key: 'earned',
                render:(text, record)=> formatFloat(record.balanceHours - record.carryForward)
            },
            {
                title: 'Used YTD',
                dataIndex: 'used',
                key: 'used',
                render:(text) => formatFloat(text)
            },
            {
                title: 'Balance',
                dataIndex: 'balanceHours',
                key: 'balanceHours',
                render:(text) => formatFloat(text)
            },
        ];

        this.state = {
            data: [],
        }
    }

    componentDidMount = () =>{
        getLeaveBalance().then(res=>{
            if(res.success){
                this.setState({
                    data: res.data
                })
            }
        })
    }

    handleSave = (row) => {
        const data = [...this.state.data];
        const index = data.findIndex((item) => row.id === item.id);
        const item = data[index];
        data.splice(index, 1, { ...item, ...row });

        this.setState({
          data,
        });
      };

    render(){
        const { data } = this.state
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    ...col,
                    record,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <Row>
                <Col span={24}>
                    <Table
                        components={components}
                        // rowClassName={() => 'editable-cell'}
                        bordered
                        rowKey={(data) => data.id} 
                        columns={columns}
                        dataSource={data}
                        size='small'
                    />
                </Col>
            </Row>
        )
    }
}

export default LeaveBalance