import React, { useState, useEffect, useCallback, useContext, useRef } from 'react'
import { Col, InputNumber, Row, Table, Typography, Form } from 'antd'
import { formatCurrency, getFiscalYear, parseDate } from '../../../service/constant';
import { getWorkInHandForecast } from '../../../service/reports-Apis';
import "../../Styles/table.css"
import { comunication_expenses, contribution_margin, cost_of_sale, direct_overhead_expense, income_revenue, occupancy_expenses, other_general_expenses, outside_expenses, supplies_expenses, travel_entertainment_expenses } from './WIHData';
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
    key,
    record,
    indexing,
    handleSave,
    ...restProps
  }) => {
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
  
    const toggleEdit = () => {
      form.setFieldsValue({
        [key]: record[key],
      });
    };
    
    const save = async () => {
      try {
        const value = isNaN(parseFloat(inputRef.current.value))? 0 : parseFloat(inputRef.current.value)
        // console.log(inputRef.current.value)
        toggleEdit();
        handleSave(indexing, dataIndex, value, record);
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
  
    let childNode = children;
  
    if (editable) {
      childNode =  (
        <Row >
          <Col >
            <Form.Item
              style={{
                margin: 0,
              }}
              name={key}
            >
              <InputNumber
                ref={inputRef}
                size="small"
                onFocus={()=>{toggleEdit(key)}}
                onChange={()=> save()}
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
    let {start, end} = getFiscalYear('dates')
    const fiscal = moment(end).format('[FY]YY')
    const forecastMonth = moment().subtract(1, 'month').endOf("month")

    const [dataSource, setDataSource] = useState([])
    const [backupData, setBackupData] = useState([])
    const [columns, setColumns] = useState([
        {
            title: '1LM - Whole A$',
            dataIndex: 'name',
            key: 'name',
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
        let newColumns = [...columns]
        let monthColumns = []
        // let endDate = '06/30/2021'
        for (var iDate = parseDate(start); iDate.isSameOrBefore(end); iDate.add(1, 'months')) {
            let el = {
              year: parseDate(iDate, 'MMM YY'),
              era: iDate.isBefore(moment(), 'month') ? 'Actual': 'Forecast',
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
        
        console.log("Lengths...", {revenue: income_revenue.length, cost: cost_of_sale.length, doh: direct_overhead_expense.length})

        setDataSource(new Array(
            ...income_revenue,
            ...cost_of_sale,
            ...contribution_margin,
            ...direct_overhead_expense
        ));

        setBackupData(JSON.parse(JSON.stringify(Array(
            ...income_revenue,
            ...cost_of_sale,
            ...contribution_margin,
            ...direct_overhead_expense
        ))))

    };
    const testing = (index, dataIndex,)=>{
        console.log(backupData?.[index]?.[dataIndex], "Backup", dataSource?.[index]?.[dataIndex], "dataSource")
        // console.log(index, dataIndex, value)
    }
    // testing(8, "Jul 22")

    const updateField = (index, dataIndex, value, record)=>{
        let newData = [...dataSource]
        //for Revenue 
        if(record.identifier === 'revenue'){
            newData[index][dataIndex] = value
            // newData[8][dataIndex] = getValueWithCondition(backupData, 8, dataIndex) + value
            // newData[31][dataIndex] = getValueWithCondition(backupData, 31, dataIndex) + value
            // newData[33][dataIndex] = getValueWithCondition(backupData, 33, dataIndex) + value
            // console.log(getValueWithCondition(newData, index, dataIndex), dataIndex)
            newData[index]['total'] = 0
            newData[8]['total'] = 0
            for (var iDate = parseDate(start); iDate.isSameOrBefore(end); iDate.add(1, 'months')) {
                let key = parseDate(iDate, 'MMM YY')
                    // console.log(getValueWithCondition(newDa  ta, index, 'total') , getValueWithCondition(newData, index, key), key)
                    newData[index]['total'] = getValueWithCondition(newData, index, 'total') +getValueWithCondition(newData, index, key)
                    newData[8]['total'] =  getValueWithCondition(newData, 8, 'total') +getValueWithCondition(newData, 8, key)
                    // newData[31][fiscal] =  getValueWithCondition(newData, 31, fiscal) +getValueWithCondition(newData, 31, key)
            }
            // console.log(getValueWithCondition(newData, index, fiscal))
            setDataSource([...newData])
        }
        // console.log(index, dataIndex, value)
    }

    // console.log(dataSource)
    
    const components = {
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      };

    const mapColumns = col => {
      const newCol = {
        ...col,
        onCell: (record, index) => ({
          record,
          editable: col.dataIndex !== 'name' && !col.dataIndex.startsWith('FY') && record.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          indexing: index,
          handleSave: updateField
        })
      };
      if (col.children) {
          newCol.children = col.children.map(mapColumns);
      }
      return newCol;
    };
  
    const re_column = columns.map(mapColumns);
    
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
      onCell: (record)=> {
          return {className: year.startsWith('FY') ? 'fin-total': ''} 
      },
      render: (text,record, index) =>{
          if(record.render){
              return record.render(year, record)
          }
          if(year.startsWith('FY')){
              // let totalYear = 0
              // for (var iDate = parseDate('07/01/2020'); iDate.isSameOrBefore('06/30/2021'); iDate.add(1, 'months')) {
              //     totalYear += record[parseDate(iDate, 'MMM YY')] ?? 0
              // }
              if(index=== 8){
                console.log(record.total)
              }
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

const getValueWithCondition = (obj, index, key) =>{
    return obj?.[index]?.[key]
      ? isNaN(parseFloat(obj[index][key]))
        ? 0
        : parseFloat(obj[index][key])
      : 0;
}