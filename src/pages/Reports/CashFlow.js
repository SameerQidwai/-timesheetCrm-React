import React, { useState, useEffect, useContext, useRef } from 'react'
import { Col, InputNumber, Row, Table, Typography, Form, Popconfirm, Button, Input, Tooltip } from 'antd'
import { formatCurrency, getFiscalYear, parseDate } from '../../service/constant';
import { getSaveCashFlow, updateSaveCashFlow } from '../../service/financial-Apis';
import "../../../src/components/Styles/table.css"
import { cash_inflows, cash_outflows, closing_cashflows, formatNegativeValue, getValueWithCondition, nextFocus } from '../../components/Core/ReportFilters/CashFlowData';
import moment from 'moment'
import {FYSelect} from '../../components/Core/Custom/Index';
import { formatter, parser } from '../../components/Core/Forms/FormItems';
const {Title} = Typography
const EditableContext = React.createContext(null);
const nextFocusFor = nextFocus()
  
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
  dataIndex = dataIndex === 'Comments' ? 'description' :dataIndex
  let comment_key = form.getFieldValue([record?.['key'], dataIndex]);

  const save = async (entered) => {
    let value = form.getFieldValue([record['key'], dataIndex]);
    let updated = form.isFieldTouched([record['key'], dataIndex]);
    if (updated) {
      try {
        handleSave(indexing, dataIndex, value);
        setTimeout(() => {
          form.setFields([
            { name: [record['key'], dataIndex], touched: false },
          ]);
          if (entered) {
            form
              .getFieldInstance([nextFocusFor[record['key']], dataIndex])
              .focus();
          }
        }, 1000);
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    } else {
      if (entered) {
        form.getFieldInstance([nextFocusFor[record['key']], dataIndex]).focus();
      }
    }
  };

  let childNode = children;

  if (editable) {
    if (dataIndex === 'description') {
      childNode = (
        <Row>
          <Col>
            <Tooltip title={comment_key} placement="top" destroyTooltipOnHide>
              <Form.Item
                style={{
                  margin: 0,
                }}
                initialValue={""}
                name={[record['key'], 'description']}
              >
                <Input
                  ref={inputRef}
                  className="table-inputNumber-border"
                  controls={false}
                  size="small"
                  onBlur={() => save()}
                  onPressEnter={(event) => save(true)}
                />
              </Form.Item>
            </Tooltip>
          </Col>
        </Row>
      );
    } else if (!record?.['partialEdit'] || moment(dataIndex, 'MMM YY').format('MMM') === record?.['partialEdit']) {
      childNode = (
        <Row>
          <Col>
            <Form.Item
              style={{
                margin: 0,
              }}
              name={[record['key'], dataIndex]}
            >
              <InputNumber
                ref={inputRef}
                className="table-inputNumber-border"
                controls={false}
                // bordered={false}
                size="small"
                formatter={(value) => formatter(value, '$')}
                parser={(value) => parser(value, '$')}
                // onFocus={()=>{ setBlurHook(true) }}
                onBlur={() => save()}
                onPressEnter={(event) => save(true)}
              />
            </Form.Item>
          </Col>
        </Row>
      );
    } 
    // else if (
    //   moment(dataIndex, 'MMM YY').format('MMM') === record?.['partialEdit']
    // ) {
    //   childNode = (
    //     <Row>
    //       <Col>
    //         <Form.Item
    //           style={{
    //             margin: 0,
    //           }}
    //           name={[record['key'], dataIndex]}
    //         >
    //           <InputNumber
    //             ref={inputRef}
    //             className="table-inputNumber-border"
    //             controls={false}
    //             // bordered={false}
    //             size="small"
    //             formatter={(value) => formatter(value, '$')}
    //             parser={(value) => parser(value, '$')}
    //             // onFocus={()=>{ setBlurHook(true) }}
    //             onBlur={() => save()}
    //             onPressEnter={(event) => save(true)}
    //           />
    //         </Form.Item>
    //       </Col>
    //     </Row>
    //   );
    // }
  }

  return <td {...restProps}>{childNode}</td>;
};


function CashFlow() {
  const [form] = Form.useForm();
  let { start: currFYStart, end: currFYEnd } = getFiscalYear('dates');
  const [year, setYear] = useState({
    start: currFYStart,
    end: currFYEnd,
    fiscal: moment(currFYEnd).format('[FY]YY'),
  });
  // const forecastMonth = moment().subtract(1, 'month').endOf("month")
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(true)
  const [columns, setColumns] = useState([
      {
          title: <> <div>Month</div>Actual/Forecast</>,
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
          title: ``,
          children: [
              {
                  title: '',
                  children: []
              }
          ]
      }
  ] )

  useEffect(() => {
      creatingCol()
      getSaveCashFlow(year).then(res=>{
          if(res.success){
            structureData(res.data)
            form.setFieldsValue(res.data)
          }
      })
      // dummyStructureData()
  }, [year])

  const creatingCol = () =>{
      let newColumns = [...columns]
      let monthColumns = [
        monthCol({
          year: 'Comments',
          // era: 'Actual',
        })
      ]
      // let endDate = '06/30/2021'
      for (var iDate = parseDate(year.start); iDate.isSameOrBefore(year.end); iDate.add(1, 'months')) {
          let el = {
            year: parseDate(iDate, 'MMM YY'),
            era: iDate.isBefore(moment(), 'month') ? 'Actual': 'Forecast',
          };
          monthColumns.push(monthCol(el, updateField))
      }                                                         // forecast-total
      // monthColumns.push(monthCol({year: fiscal, era: 'Forcaste', totalKey: 'total'}))
      newColumns[1]['children'][0]['children'] = monthColumns
      setColumns(newColumns)
  }

  const structureData = (savedCash) => {
    let cashFlowAcc = new Array(
      ...cash_inflows,
      ...cash_outflows,
      ...closing_cashflows,
    )

    cashFlowAcc = cashFlowAcc.map(el=>{
      if (savedCash[el.key]){
        el = {...el, ...savedCash[el.key]}
      }
      return el
    })
    calculate_col_total(cashFlowAcc);
  };

  const calculate_col_total = (updatedData)=>{
    
    let newData = [...updatedData]
    let columName = columns?.[1]?.['children']?.[0]?.['children']||[];

    columName.forEach(({ children: [{ dataIndex }] }) => {
      const inflowIndex = 6 /**Inflow Total Index*/
      const outflowIndex = 33 /**outflow Total Index*/
      const surplusIndex = 35 /**sum of this month*/
      const closingIndex = 36 /**closing of this month*/
      const openingIndex =2 /**opening of next month*/

      newData[inflowIndex][dataIndex] = 0; /**Inflow Total */
      newData[outflowIndex][dataIndex] = 0; /**outflows */

      for (let i = 0; i < newData.length; i++) {
        if (moment(dataIndex, 'MMM YY', true).isValid()) {
          const value = getValueWithCondition( newData, i, dataIndex )
          if (i < inflowIndex) {
            newData[inflowIndex][dataIndex] += value;
          } else if (i > inflowIndex && i < outflowIndex) {
            newData[outflowIndex][dataIndex] += value
          }else if (i === surplusIndex){
            newData[surplusIndex][dataIndex] = newData?.[surplusIndex]?.renderCalculation?.(newData, dataIndex)
          }else if ( i === closingIndex){
            let closing_of_month = newData?.[closingIndex]?.renderCalculation?.(newData, dataIndex)
            newData[closingIndex][dataIndex] = closing_of_month

            let nextDataIndex = moment(dataIndex, 'MMM YY', true).add(1,'month').format('MMM YY')
            newData[openingIndex][nextDataIndex] = closing_of_month
          }
        }
      }
    }); 
    setDataSource(newData)
    setLoading(false)
    return true
  }
  

  const updateField = (index, dataIndex, value, openField)=>{
    setLoading(true)
    let newData = [...dataSource]
    newData[index][dataIndex] = value
    return calculate_col_total(newData)
    // openField(false)
  }

  const onFormSubmit = (values) =>{
    setLoading(true)
    for (const key in values) {
      values[key]['description']  = values[key]['description'] ?  values[key]['description'] : ''
    }
    updateSaveCashFlow(values).then(res=>{
      setLoading(false)
      // if(res)
    })
  }
    
  const components = {
    body: {
      // row: EditableRow,
      cell: EditableCell,
    },
  };

  const mapColumns = col => {
    const newCol = {
      ...col,
      onCell: (record, index) => ({
        record,
        editable: col.dataIndex !== 'name' && !col.totalCol && record.editable,
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
      <Row
        style={{ backgroundColor: '#0463AC', paddingRight: 15 }}
        justify="space-between"
        align="middle"
      >
        <Col xs={24} sm={24} md={12} lg={12}>
          <Row style={{ height: '48px' }} align="middle">
            <Col span={24}>
              <Title
                level={5}
                style={{ color: '#fff', marginBottom: 0, paddingLeft: 5 }}
              >
                Cashflow Forecast {year.fiscal}
              </Title>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Row gutter={20} justify="end">
            <Col xs={12} sm={12} md={14} lg={10}>
              <FYSelect
                callBack={({ start, end, closed }) => {
                  setLoading(true);
                  let currentDate = moment();
                  setYear({
                    start,
                    end,
                    closed,
                    fiscal: end.format('[FY]YY'),
                    month: currentDate.isBetween(start, end)
                      ? currentDate
                      : currentDate.isBefore(start)
                      ? start
                      : end,
                  });
                }}
              />
            </Col>
            <Col>
              <Popconfirm
                placement="bottom"
                title="Are you sure want to save new Settings?"
                onConfirm={() => form.submit()}
                okText="Yes"
                cancelText="No"
                disabled={year.closed}
              >
                <Button disabled={year.closed} type="primary" a size="small">
                  Save
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form form={form} component={false} onFinish={onFormSubmit}>
            <EditableContext.Provider value={form}>
              <Table
                components={components}
                bordered
                loading={loading}
                // loading={true}
                size="small"
                pagination={false}
                rowKey={(row) => row.key ?? row.name}
                columns={re_column}
                rowClassName={(row) => row.className}
                dataSource={dataSource}
                className="scroll-table fs-v-small full-width wih-report"
                scroll={{
                  x: 'max-content',
                  y: '65vh',
                }}
              />
            </EditableContext.Provider>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default CashFlow

// -------------Helper-------
const monthCol = ({year, era, totalKey})=>({
  title: year,
  align: 'center',
  children: [
    {
      title: era,
      dataIndex: year,
      key: year,
      width: year ==='Comments'?200:100,
      align: 'center',
      onCell: (record)=> {
          return {className: year.startsWith('FY') ? 'fin-total': ''} 
      },
      render: (text,record, index) =>{
          if(record.render){
              return record.render(year, record)
          }
          if(year.startsWith('FY')){
            
              return record[totalKey] ? formatNegativeValue(record[totalKey]) : '-'
          }
              //checking if number is integer                     //if total column put - of undefned or 0
          return (text>= 0 ||text<= 0) ? formatCurrency(text) : record.className === 'total-row'? '-' : record.default !== undefined? formatCurrency(record.default) : <span style={{color: 'white'}}>-</span> 
      }       //udefiend and null can't work on isNaN                                                      //checking if any default value is given 
    }
  ],
})

