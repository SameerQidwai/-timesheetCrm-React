import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Col,
  InputNumber,
  Row,
  Table,
  Typography,
  Form,
  Popconfirm,
  Button,
  Select,
} from 'antd';
import {
  formatCurrency,
  getFiscalYear,
  parseDate,
} from '../../service/constant';
import {
  getSaveForecast,
  getWorkInHandForecast,
  updateSaveForecast,
} from '../../service/financial-Apis';
import {
  contribution_margin,
  cost_of_sale,
  direct_overhead_expense,
  formatNegativeValue,
  getValueWithCondition,
  income_revenue,
  income_tax,
  net_profit,
  nextFocus,
} from '../../components/Core/ReportFilters/WIHData';
import moment from 'moment';
import { formatter, parser } from '../../components/Core/Forms/FormItems';
import '../../../src/components/Styles/table.css';
import { FYSelect } from '../../components/Core/Custom/Index';
import DrawerView from '../../components/Core/DrawerView';
const { Title } = Typography;
const EditableContext = React.createContext(null);
const nextFocusFor = nextFocus();

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

  return <td {...restProps}>{childNode}</td>;
};

function WorkInHand() {
  const [form] = Form.useForm();
  // let { start: currFYStart, end: currFYEnd } = getFiscalYear('dates');
  // const [year, setYear] = useState({
  //   start: currFYStart,
  //   end: currFYEnd,
  //   fiscal: moment(currFYEnd).format('[FY]YY'),
  // });
  const [year, setYear] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [incomeTaxRates, setIncomeTaxRates] = useState(undefined);
  const [revenueDetail, setRevenueDetail] = useState({open: false, projects: {}, opportunities:{}})

  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([
    {
      title: 'Whole A$',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      onHeaderCell: () => {
        return {
          className: 'whole',
        };
      },
      onCell: ({ className }) => {
        return {
          className: className,
        };
      },
      // align: 'center',
      fixed: 'left',
    },
    {
      title: `Forecast`,
      children: [
        {
          title: 'Revenue AU$',
          children: [],
        },
      ],
    }
  ]);

  // useEffect(() => {
  //   if (year){
  //     creatingCol()
  //     console.timeEnd('timing');
  //     setTimeout(() => {
  //       Promise.all([getSaveForecast(year), getWorkInHandForecast(year)], ).then(
  //         (res) => {
  //           let saveForecast = res[0].success ? res[0].data : {};
  //           let forecast = res[1].success ? res[1].data : {};
  //           structureData(forecast, saveForecast);
  //           setIncomeTaxRates(forecast.INCOME_TAX_RATES ?? {});
  //           form.setFieldsValue(saveForecast);
  //         }
  //       );
  //     }, 4000);
  //   }
  // }, [year]);
  useEffect(() => {
    if (columns?.[1]?.['children']?.[0]?.['children']?.length){
      Promise.all([getSaveForecast(year), getWorkInHandForecast(year)], ).then(
        (res) => {
          let saveForecast = res[0].success ? res[0].data : {};
          let forecast = res[1].success ? res[1].data : {};
          structureData(forecast, saveForecast);
          setIncomeTaxRates(forecast.INCOME_TAX_RATES ?? {});
          form.setFieldsValue(saveForecast);
        }
      );
    }
  }, [columns]);

  useEffect(() => {
    if (year){
      creatingCol()
    }
  }, [year]);

  const creatingCol = () => {
    let newColumns = [...columns];
    newColumns[1] = {
      title: `${year?.fiscal} Forecast`,
      children: [
        {
          title: 'Revenue AU$',
          children: [],
        },
      ],
    }; 
    let monthColumns = [
      monthCol({
        year: 'YTD',
        era: '',
        totalKey: 'YTD',
      }),
    ];
    // let endDate = '06/30/2021'
    for (
      var iDate = parseDate(year?.start);
      iDate.isSameOrBefore(year?.end);
      iDate.add(1, 'months')
    ) {
      let el = {
        year: parseDate(iDate, 'MMM YY'),
        era: iDate.isBefore(moment(), 'month') ? 'Actual' : 'Forecast',
      };
      monthColumns.push(monthCol(el, updateField));
    } // forecast-total
    monthColumns.push(
      monthCol({ year: year?.fiscal, era: iDate.isAfter(moment(), 'day')? 'Actual' : 'Forecast', totalKey: 'total' })
    );
    newColumns[1]['children'][0]['children'] = monthColumns;
    setColumns(newColumns);
  };

  const structureData = (
    {
      MILESTONE_BASE,
      TIME_BASE,
      LEAD_COST,
      LEAD_TIME_BASE,
      PERMANENT_SALARIES,
      PERMANENT_SUPER,
      CASUAL_SALARIES,
      SUB_SALARIES,
      CASUAL_SUPER,
      DOH_SALARIES,
      DOH_SUPER,
      INCOME_TAX_RATES,
    },
    saveForecast
  ) => {

    let REVENUES = {}
    setRevenueDetail({projects: TIME_BASE, opportunities:LEAD_TIME_BASE})
    //merging lead and project revenue together
    for (
      var iDate = parseDate(year?.start);
      iDate.isSameOrBefore(year?.end);
      iDate.add(1, 'months')
    ) {
      let key = parseDate(iDate, 'MMM YY')
      REVENUES[key] = (TIME_BASE[key]??0) + (LEAD_TIME_BASE[key]??0)
    }
    

    income_revenue[1] = { ...income_revenue[1], ...REVENUES };
    income_revenue[2] = { ...income_revenue[2], ...MILESTONE_BASE };
    // income_revenue[8] = { ...income_revenue[8], ...TOTAL_REVENUE };

    cost_of_sale[2] = { ...cost_of_sale[2], ...PERMANENT_SALARIES };
    cost_of_sale[3] = { ...cost_of_sale[3], ...CASUAL_SALARIES };
    cost_of_sale[4] = { ...cost_of_sale[4], ...SUB_SALARIES };
    cost_of_sale[5] = { ...cost_of_sale[5], ...PERMANENT_SUPER };
    cost_of_sale[6] = { ...cost_of_sale[6], ...CASUAL_SUPER };
    // cost_of_sale[5] = { ...cost_of_sale[5], ...CASUAL_SUPER };
    cost_of_sale[21] = { ...cost_of_sale[21], ...LEAD_COST };
    // cost_of_sale[21] = { ...cost_of_sale[21], ...TOTAL_COST };



    direct_overhead_expense[2] = {
      ...direct_overhead_expense[2],
      ...DOH_SALARIES,
    };
    direct_overhead_expense[3] = {
      ...direct_overhead_expense[3],
      ...DOH_SUPER,
    };
    // direct_overhead_expense[18] = { ...direct_overhead_expense[18], ...TOTAL_DOH };

    // net_profit[2] = {...net_profit[2], ...INCOME_TAX_RATES}

    let dataWithTotal = new Array(
      ...income_revenue,
      ...cost_of_sale,
      ...contribution_margin,
      ...direct_overhead_expense,
      ...income_tax,
      ...net_profit
    );

    dataWithTotal = dataWithTotal.map((el) => {
      if (saveForecast[el.key]) {
        el = { ...el, ...saveForecast[el.key] };
      }
      return el;
    });
    calculate_col_total(dataWithTotal, INCOME_TAX_RATES);
  };

  const calculate_col_total = (updatedData, INCOME_TAX_RATES = {}) => {
    let newData = [...updatedData];
    // console.log(newData)
    let columName = columns?.[1]?.['children']?.[0]?.['children'] || [];

    columName.forEach(({ children: [{ dataIndex, name }] }) => {
      newData[8][dataIndex] = 0; /**Revenue */
      newData[33][dataIndex] = 0; /**COST */
      newData[60][dataIndex] = 0; /**DOH */
      // newData[62][dataIndex]=0; /**TAX */
      // newData[66][dataIndex]=0; /**Profit */

      for (let i = 0; i < newData.length; i++) {
        // console.log(i, newData[i]["renderCalculation"])
        // dataIndex = dataIndex.startsWith('FY')? 'total' : dataIndex
        if (moment(dataIndex, 'MMM YY', true).isValid()) {
          if (i < 8) {
            newData[8][dataIndex] += getValueWithCondition(
              newData,
              i,
              dataIndex
            );
          } else if (i > 8 && i < 33) {
            newData[33][dataIndex] += getValueWithCondition(
              newData,
              i,
              dataIndex
            );
          } else if (i > 37 && i < 60) {
            newData[60][dataIndex] += getValueWithCondition(
              newData,
              i,
              dataIndex
            );
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
    });
    /**
     * 35 = CM
     * 37 = CM%
     * 62 =EBIT
     * 68 = "PROFIT BEFORE TAX"
     * 70 = "Income Tax Expense"
     * 72 = "NET PROFIT"
     */
    let calculate_indexes = [35, 37, 62, 68, 70, 72];
    columName.forEach(({ children: [{ dataIndex }] }) => {
      calculate_indexes.forEach((index) => {
        newData[index] = {
          ...newData[index],
          [dataIndex]: newData?.[index]?.renderCalculation?.(
            newData,
            dataIndex,
            INCOME_TAX_RATES[dataIndex]
          ),
        };
      });
    });

    // newData = newData.map(item => {
    //   return {
    //     ...item,
    //     'YTD':columName.reduce((acc, {children: [{dataIndex, title}]}) => {
    //       if (moment(dataIndex, 'MMM YY', true).isValid() && title === 'Actual') {
    //         acc += item[dataIndex] || 0;
    //       }
    //       return acc;
    //     }, 0),
    //     total: columName.reduce((acc, {children: [{dataIndex}]}) => {
    //       if (moment(dataIndex, 'MMM YY', true).isValid()) {
    //         acc += item[dataIndex] || 0;
    //       }
    //       return acc;
    //     }, 0)
    //   };
    // });

    newData = newData.map((item) => {
      let actualTotal = 0;
      let total = 0;
      for (let i = 0; i < columName.length; i++) {
        const {
          children: [{ dataIndex, title }],
        } = columName[i];
        if (moment(dataIndex, 'MMM YY', true).isValid()) {
          const value = +item[dataIndex] || 0;
          total += value;
          if (title === 'Actual') {
            actualTotal += value;
          }
        }
      }
      return {
        ...item,
        YTD: actualTotal,
        total,
      };
    });
    setLoading(false);
    setDataSource(newData);
    return true;
    // setLoading(false)
  };

  const updateField = (index, dataIndex, value, openField) => {
    let newData = [...dataSource];
    newData[index][dataIndex] = value;
    return calculate_col_total(newData, incomeTaxRates);
    // openField(false)
  };

  const onFormSubmit = (values) => {
    setLoading(true);
    updateSaveForecast(values).then((res) => {
      setLoading(false);
      // if(res)
    });
  };

  const components = {
    body: {
      // row: EditableRow,
      cell: EditableCell,
    },
  };

  const mapColumns = (col) => {
    const newCol = {
      ...col,
      onCell: (record, index) => ({
        record,
        editable: col.dataIndex !== 'name' && !col.totalCol && record.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        indexing: index,
        handleSave: updateField,
      }),
    };

    if (col.children) {
      newCol.children = col.children.map(mapColumns);
    }
    return newCol;
  };

  const re_column = columns.map(mapColumns);

  const showRevenueDetail = (open) =>{
    setRevenueDetail((prev) => ({ ...prev, open, year }));
  }

  return (
    <>
      <Row
        style={{ backgroundColor: '#0463AC', paddingRight: 15 }}
        justify="space-between"
        align="middle"
      >
        <Col xs={24} sm={24} md={12} lg={12}>
          <Row>
            <Col span={24}>
              <Title
                level={5}
                style={{ color: '#fff', marginBottom: 0, paddingLeft: 5 }}
              >
                Forecast {year?.fiscal} - {year?.month.format('MMMM')} Month End
              </Title>
            </Col>
            <Col span={24}>
              <Title
                level={5}
                style={{ color: '#fff', marginBottom: 0, paddingLeft: 5 }}
              >
                Profit & Loss Statement - {year?.month.format('DD MMMM YYYY')}
              </Title>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Row gutter={20} justify="end">
            <Col xs={12} sm={12} md={14} lg={10}>
              <FYSelect
                defaultValue
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
                disabled={year?.closed}
              >
                <Button disabled={year?.closed} type="primary" size="small">
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
                onRow={(record, rowIndex) => {
                  if (record.key === 'Revenue - T&M Basis'){
                    return {
                      onDoubleClick: () => {showRevenueDetail(true) }, // double click row
                    };
                  }
                }}
              />
            </EditableContext.Provider>
          </Form>
        </Col>
      </Row>
      {revenueDetail.open &&<DrawerView
        visible={revenueDetail.open}
        onClose={() => showRevenueDetail(false)}
        placement="right"
        width={640}
        content={{
          title: 'Revenue Breakdown',
          key: 'workInHandForecast',
          data: revenueDetail,
        }}
      />}
    </>
  );
}

export default WorkInHand;

// -------------Helper-------
const monthCol = ({ year, era, totalKey }) => ({
  title: year,
  align: 'center',
  children: [
    {
      title: era,
      dataIndex: year,
      key: year,
      totalCol: !!totalKey,
      width: 100,
      align: 'center',
      onCell: (record) => {
        return { className: totalKey ? 'fin-total' : '' };
      },
      render: (text, record, index) => {
        if (record.render) {
          return record.render(year, record);
        }
        if (totalKey) {
          return record[totalKey] ? formatNegativeValue(record[totalKey]) : '-';
        }
        //checking if number is integer                     //if total column put - of undefned or 0
        return text >= 0 || text <= 0
          ? formatCurrency(text)
          : record.className === 'total-row'
          ? '-'
          : record.default !== undefined
          ? formatCurrency(record.default)
          : '';
      }, //udefiend and null can't work on isNaN                                                      //checking if any default value is given
    },
  ],
});
