import React, { useState, useEffect, useCallback, useContext, useRef } from 'react'
import { Col, InputNumber, Row, Table, Typography, Form } from 'antd'
import { formatCurrency, getFiscalYear, parseDate } from '../../service/constant';
import { getWorkInHandForecast } from '../../service/reports-Apis';
import "../../../src/components/Styles/table.css"
import { comunication_expenses, contribution_margin, cost_of_sale, direct_overhead_expense, income_revenue, occupancy_expenses, other_general_expenses, outside_expenses, supplies_expenses, travel_entertainment_expenses } from '../../components/Core/ReportFilters/WIHData';
import moment from 'moment'
const {Title} = Typography
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
  
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
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
        // toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
  
    let childNode = children;
  
    if (editable) {
      childNode =  (
        <Row >
          {/* <Col span={10}> */}
          <Col >
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
                size="small"
                // onBlur={()=> setTimeout(() => { setEditing(!editing) }, 300)}
              />
            </Form.Item>
          </Col>
        </Row>
      ) 
    }
  
    return <td {...restProps}>{childNode}</td>;
  };


function WorkInHand() {
    const fiscal = getFiscalYear('dates').end.format('[FY]YY')
    const forecastMonth = moment().subtract(1, 'month').endOf("month")

    const [dataSource, setDataSource] = useState([])
    const [columns, setColumns] = useState([
        {
            title: '1LM - Whole A$',
            dataIndex: 'name',
            key: 'key',
            width: 250,
            onHeaderCell: ()=> {
                return {
                    className: 'whole'
                }
            },
            onCell: ({className})=>{
                return {
                    className: className
                }
            },
            // align: 'center',
            fixed: 'left',
        },
        {
            title: `${fiscal} Forecast`,
            children: [
                {
                    title: 'Revenue AU$',
                    children: []
                }
            ]
        }
    ] )

    
    useEffect(() => {
        creatingCol()
        getWorkInHandForecast().then(res=>{
            if(res.success){
                structureData(res.data)
            }
        })
        // dummyStructureData()
    }, [])

    const creatingCol = () =>{
        let {start, end} = getFiscalYear('dates')
        let newColumns = [...columns]
        let monthColumns = []
        // let endDate = '06/30/2021'
        for (var iDate = parseDate(start); iDate.isSameOrBefore(end); iDate.add(1, 'months')) {
            let el = {
              year: parseDate(iDate, 'MMM YY'),
              era: iDate.isSameOrBefore(moment(), 'month') ? 'Actual': 'Forecast',
            };
            monthColumns.push(monthCol(el, updateField))
        }
        monthColumns.push(monthCol({year: fiscal, era: 'Forcaste'}))
        newColumns[1]['children'][0]['children'] = monthColumns
        setColumns(newColumns)
    }
    const structureData = ({
        MILESTONE_BASE,
        TIME_BASE,
        PERMANENT_SALARIES,
        PERMANENT_SUPER,
        CASUAL_SALARIES,
        CASUAL_SUPER,
        DOH_SALARIES,
        DOH_SUPER,
        TOTAL_REVENUE,
        TOTAL_COST,
        TOTAL_DOH
    }) => {
        income_revenue[1] = { ...income_revenue[1], ...TIME_BASE };
        income_revenue[2] = { ...income_revenue[2], ...MILESTONE_BASE };
        income_revenue[8] = { ...income_revenue[8], ...TOTAL_REVENUE };

        cost_of_sale[2] = { ...cost_of_sale[2], ...PERMANENT_SALARIES };
        cost_of_sale[3] = { ...cost_of_sale[3], ...CASUAL_SALARIES };
        cost_of_sale[4] = { ...cost_of_sale[4], ...PERMANENT_SUPER };
        cost_of_sale[5] = { ...cost_of_sale[5], ...CASUAL_SUPER };
        cost_of_sale[5] = { ...cost_of_sale[5], ...CASUAL_SUPER };
        cost_of_sale[21] = { ...cost_of_sale[21], ...TOTAL_COST };
        contribution_margin[1] = {...contribution_margin[1], TOTAL_COST, TOTAL_REVENUE}
        contribution_margin[3] = {...contribution_margin[3], TOTAL_COST, TOTAL_REVENUE}


        direct_overhead_expense[3] = { ...direct_overhead_expense[3], ...DOH_SALARIES };
        direct_overhead_expense[4] = { ...direct_overhead_expense[4], ...DOH_SUPER };
        direct_overhead_expense[18] = { ...direct_overhead_expense[18], ...TOTAL_DOH };


        setDataSource([
            ...income_revenue,
            ...cost_of_sale,
            ...contribution_margin,
            ...direct_overhead_expense,
            // ...occupancy_expenses,
            // ...supplies_expenses,
            // ...comunication_expenses,
            // ...outside_expenses,
            // ...travel_entertainment_expenses,
            // ...other_general_expenses,
        ]);

    };

    const updateField = useCallback(
            (value=0, key) => {
                console.log(value, key)
            //   let newData = [...dataSource]
            // newData[8][key] = parseFloat(newData[8][key]) + value
            // setDataSource(newData)
          },
          [dataSource],
    )
    
    const components = {
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      };

    const mapColumns = col => {
      // if (!col.editable) {
      //   return col;
      // }
      const newCol = {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: ()=>{console.log("does this working?")}
        })
      };
      if (col.children) {
          newCol.children = col.children.map(mapColumns);
      }
      return newCol;
    };
  
    const re_column = columns.map(mapColumns);
    console.log(re_column)
    
  return (
    <>
        <Row style={{backgroundColor: '#0463AC'}}>
            <Col span={24}>
                <Title level={5} style={{color: '#fff', marginBottom: 0, paddingLeft: 5 }}> 1LM Forecast {fiscal} - {forecastMonth.format('MMMM')} Month End</Title>
            </Col>
            <Col span={24}>
                <Title level={5} style={{color: '#fff', marginBottom: 0, paddingLeft: 5 }}>Profit & Loss Statement - {forecastMonth.format('DD MMMM YYYY')}</Title>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Table
                    components={components}
                    bordered
                    size="small"
                    pagination = {false}
                    rowKey={(row)=> row.key??row.name}
                    columns={re_column}
                    rowClassName={(row)=> row.className}
                    dataSource={dataSource}
                    className="scroll-table fs-v-small full-width wih-report"
                    scroll={{
                        x: "max-content",
                        y: '65vh',
                    }}
                />
            </Col>
        </Row>
    </>
  )
}

export default WorkInHand

// -------------Helper-------
const monthCol = ({year, era}, updateField)=>({
  title: year,
  align: 'center',
  children: [
    {
      title: era,
      dataIndex: year,
      key: year,
      width: 100,
      align: 'center',
      onCell: ()=> {
          return {className: year.startsWith('FY') ? 'fin-total': ''} 
      },
      render: (text,record) =>{
          if(record.render){
              return record.render(year, record)
          }
          if(year.startsWith('FY')){
              // let totalYear = 0
              // for (var iDate = parseDate('07/01/2020'); iDate.isSameOrBefore('06/30/2021'); iDate.add(1, 'months')) {
              //     totalYear += record[parseDate(iDate, 'MMM YY')] ?? 0
              // }
              return record.total ? formatCurrency(record.total) : '-'
          }
          if (record.openField){
              return <InputNumber 
                  size="small" 
                  placeholder='0.000'
                  onChange={(value)=>{
                      updateField(value, year)
                  }}
              />
          }
              //checking if number is integer                     //if total column put - of undefned or 0
          return (text>= 0 ||text<= 0) ? formatCurrency(text) : record.className === 'total-row'? '-' : record.default !== undefined? formatCurrency(record.default) : '' 
      }       //udefiend and null can't work on isNaN                                                      //checking if any default value is given 
    }
  ],
})