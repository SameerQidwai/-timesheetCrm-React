import React, { useState, useEffect, useContext, useRef } from 'react'
import { Col, InputNumber, Row, Table, Typography, Form } from 'antd'
import { formatCurrency, getFiscalYear, parseDate } from '../../../service/constant';
import { getWorkInHandForecast } from '../../../service/reports-Apis';
import "../../Styles/table.css"
import { contribution_margin, cost_of_sale, direct_overhead_expense, formatNegativeValue, getValueWithCondition, income_revenue, income_tax, net_profit } from './WIHData';
import moment from 'moment'
import { formatter, parser } from '../Forms/FormItems';
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

  const [blurHook, setBlurHook] = useState(false)
  
  const blurSave = ()=>{
    // console.log(form.getFieldValue([record['name'], dataIndex]))
    // value = value.replace(/[^0-9.-]/g, '')
    let value = form.getFieldValue([record['name'], dataIndex])
    value = (!value || isNaN(parseFloat(value)))? 0 : parseFloat(value)
    if (value !== record[dataIndex]){
      form.setFieldsValue({
        [record['name']]: {
          ...form.getFieldsValue(),
          [dataIndex]: record[dataIndex],
        },
      });
      
    }
    setBlurHook(false)
  }

  const save = async () => {
    let value = form.getFieldValue([record['name'], dataIndex])
    value = (!value || isNaN(parseFloat(value)))? 0 : parseFloat(value)
    if (blurHook && value){
      console.log('ran again')
      setBlurHook(false)
      try {
        handleSave(indexing, dataIndex, value, setBlurHook);
        setInterval(() => {
          setBlurHook(true)
        }, 1000);
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
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
            name={[record['name'],dataIndex]}
          >
            <InputNumber
              ref={inputRef}
              size="small"
              formatter={(value) => formatter(value, "$") }
              parser={(value) => parser(value, "$") }
              onFocus={()=>{ setBlurHook(true) }}
              onBlur={(event)=> blurSave(event)}
              onPressEnter={(event)=> save(event)}
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
  const [loading, setLoading] = useState(false)
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
    // income_revenue[8] = { ...income_revenue[8], ...TOTAL_REVENUE };
    
    cost_of_sale[2] = { ...cost_of_sale[2], ...PERMANENT_SALARIES };
    cost_of_sale[3] = { ...cost_of_sale[3], ...CASUAL_SALARIES };
    cost_of_sale[4] = { ...cost_of_sale[4], ...PERMANENT_SUPER };
    cost_of_sale[5] = { ...cost_of_sale[5], ...CASUAL_SUPER };
    cost_of_sale[5] = { ...cost_of_sale[5], ...CASUAL_SUPER };
    // cost_of_sale[21] = { ...cost_of_sale[21], ...TOTAL_COST };
    


    direct_overhead_expense[3] = { ...direct_overhead_expense[3], ...DOH_SALARIES };
    direct_overhead_expense[4] = { ...direct_overhead_expense[4], ...DOH_SUPER };
    // direct_overhead_expense[18] = { ...direct_overhead_expense[18], ...TOTAL_DOH };
    

    calculate_col_total(new Array(
        ...income_revenue,
        ...cost_of_sale,
        ...contribution_margin,
        ...direct_overhead_expense,
        ...income_tax,
        ...net_profit
    ));
  };

  const calculate_col_total = (updatedData)=>{
    let newData = [...updatedData]
    let columName = columns?.[1]?.['children']?.[0]?.['children']||[];

    (columName).forEach(({children: [{dataIndex}]})=>{
      newData[8][dataIndex]=0; /**Revenue */ 
      newData[30][dataIndex]=0; /**COST */ 
      newData[54][dataIndex]=0; /**DOH */
      newData[62][dataIndex]=0; /**TAX */
      // newData[66][dataIndex]=0; /**Profit */
  
      for(let i = 0; i < newData.length; i++){
        // console.log(i, newData[i]["name"])
      // dataIndex = dataIndex.startsWith('FY')? 'total' : dataIndex
      if (moment(dataIndex, 'MMM YY', true).isValid()){
          if (i<8){
              newData[8][dataIndex] += getValueWithCondition(newData, i, dataIndex)
          }else if (i>8 && i <30){
              newData[30][dataIndex] += getValueWithCondition(newData, i, dataIndex)
          }else if (i>34 && i <54){
              newData[54][dataIndex] += getValueWithCondition(newData, i, dataIndex)
          }
          // }else if (i>56 && i <62){
          //     newData[62][dataIndex] = newData[i]['operation'] ?
          //     getValueWithCondition(newData, 62, dataIndex) - getValueWithCondition(newData, i, dataIndex)
          // :
          //     getValueWithCondition(newData, 62, dataIndex) + getValueWithCondition(newData, i, dataIndex)
          // }else if (i>62 && i< 67){
          //     newData[66][dataIndex] = getValueWithCondition(newData, 62, dataIndex) - getValueWithCondition(newData, 64, dataIndex)
          // }
      }
      }
    }) 

     // , 64, 66   /**   CM          CM %              EBIT  */
     let calculate_indexes = [32, 34, 56, 62, 66];

     (columName).forEach(({children: [{dataIndex}]})=>{
      (calculate_indexes).forEach((index)=>{
        newData[index] = {
          ...newData[index],
          [dataIndex]: newData?.[index]?.renderCalculation(newData, dataIndex)
        }
      })
     })

    newData = newData.map(item => {
      return {
        ...item,
        total: columName.reduce((acc, {children: [{dataIndex}]}) => {
          if (moment(dataIndex, 'MMM YY', true).isValid()) {
            acc += item[dataIndex] || 0;
          }
          return acc;
        }, 0)
      };
    });
    setDataSource(newData)
    return true
    // setLoading(false)
  }
  

  const updateField = (index, dataIndex, value, openField)=>{
    let newData = [...dataSource]
    newData[index][dataIndex] = value
    return calculate_col_total(newData)
    // openField(false)
  }
    
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
    
  return (<>
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
              // loading={true}
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
  </>)
}

export default WorkInHand

// -------------Helper-------
const monthCol = ({year, era})=>({
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
            
              return record.total ? formatNegativeValue(record.total) : '-'
          }
              //checking if number is integer                     //if total column put - of undefned or 0
          return (text>= 0 ||text<= 0) ? formatCurrency(text) : record.className === 'total-row'? '-' : record.default !== undefined? formatCurrency(record.default) : '' 
      }       //udefiend and null can't work on isNaN                                                      //checking if any default value is given 
    }
  ],
})

