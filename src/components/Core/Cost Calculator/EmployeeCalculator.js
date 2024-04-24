import React, { useEffect, useState } from "react";
import { Col, Dropdown, InputNumber, Menu, Row, Typography } from "antd";

import moment from "moment";
import 'moment-weekday-calc';
import { formatter, parser } from "../Forms/FormItems";
import { formatCurrency, formatFloat, getFiscalYear, formatDate, STATES } from "../../../service/constant";

import '../../Styles/buycost.css'
import { buyCost } from "../../../service/constant-Apis";


const EmployeeCalculator = ({empId}) =>{
    const [contract, setContract] = useState({})
    const [variables, setVariables] = useState([])
    const [buyRate, setBuyRate] = useState(0)
    const [margin, setMargin] = useState([20, 25, 30, 40])
    const [adjustment, setAdjustment] = useState(0)
    const [expectedDailyHours, setExpectedDailyHours ] = useState(8.00)

    useEffect(() => {
        let fiscalYear = getFiscalYear('years')
        
        buyCost('employees', empId, 'employees').then(res=>{
            if(res.success){
                let {contract, golobalVariables, employeeBuyRate} = res.data
                /** calculating noOfDays from contract not in use  */
                let weekdays = []
                for (var i=0 ; i < contract.noOfDays ?? 5 ; i++){
                    weekdays.push(i+1);
                }
                /** noOfDays are now fixed 5 days a week throughout year */
                /** Not In use put it here just in case */
                let workdays = formatDate(new Date()).isoWeekdayCalc({  
                    rangeStart: `1 July ${fiscalYear['start']}`,  
                    rangeEnd: `30 June ${fiscalYear['end']}`,
                    weekdays: weekdays,  
                    // exclusions: holidays,
                }) 
                /**will remove isoWeekdayCalc later  and put constant workDaysPerAnum*/

                contract.workDaysPerAnum = workdays
                
                setBuyRate(employeeBuyRate)
                setContract(contract)
                setVariables(golobalVariables)
            }
      })
    
    }, [])

    const onChangeMargin = (value, index) =>{
        margin[index] = value??0
        setMargin([...margin])
    }

    const onAplicable = (value, index) =>{
        let changeVariables = variables 
        changeVariables[index]['apply'] = value
        let count = contract.hourlyBaseRate
        changeVariables = changeVariables.map((el, index)=> {
            if (el){
                if (index === 0){// if applicable              // caluclation                     
                    el.amount = el.apply === 'Yes' ? (contract?.hourlyBaseRate * el.value/100) : 0
                }else{           // if applicable              // caluclation             
                    el.amount = el.apply === 'Yes' ? (((contract?.hourlyBaseRate + changeVariables[0].amount) * el.value )/100) : 0
                }
                count += el.amount
            }
            return el
        })
        setBuyRate(count)
        setVariables([...changeVariables])
    }

    return ( 
        <div>{
            contract.hourlyBaseRate>= 0 ?
                <Row className="buy-sell-calculator">
                    <Col span={12} className="buy-cost calculator">
                        <Row> 
                            <Col span={24} className="mb-10">
                                <Typography.Title level={5}>Buy Rate Calculator - Employee</Typography.Title>
                            </Col>                 {/**for casual type emp we already set hourly base salary */}
                            <Col span={16} className="label">{contract.type=== 1 ? 'Hourly Base Salary' :'Annual Base Salary'}</Col>
                            <Col span={8} className="item">{formatCurrency(contract?.remunerationAmount)}</Col>
                            <Col span={16}  className="label">Daily Hours</Col>
                            <Col span={8}  className="item">{formatFloat(contract?.dailyHours)}</Col>
                            <Col span={16}  className="label">{`Weekly Hours - (${formatFloat(contract?.dailyHours)} * ${contract?.noOfDays} days)`}</Col>
                            <Col span={8}  className="item">{formatFloat(contract?.noOfHours)}</Col>
                            {/* we are saving noOfHOurs in week in our databse so no need to show here */}
                            <Col span={16}  className="label">Billable Days per annum</Col>
                            <Col span={8}  className="item">{contract?.workDaysPerAnum}</Col>
                            {/**for casual type emp we already set hourly base salary */}
                            <Col span={16}  className="label my-10" >{
                            contract.type=== 1 ?
                                'Hourly Base Rate' :
                                `Hourly Base Rate - (${formatCurrency(contract?.remunerationAmount)} / ${52} / ${formatFloat(contract?.noOfHours)})`
                            }</Col>
                            <Col span={8}  className="item my-10" >{formatCurrency(contract?.hourlyBaseRate)}</Col>
                            <Col span={5} offset={16} className="item"><Typography.Text underline strong >Applicable</Typography.Text></Col>

                            {variables.map((el, index)=>  el && <Col span={24} key={index}>
                                <Row>
                                    <Col span={12} className="label">
                                        { STATES[el.name]?
                                            `Payroll Tax - ${STATES[el.name]}`
                                        :
                                            el.name}
                                    </Col>
                                    <Col span={4} className="item">{`${el.value}%`}</Col>
                                    <Col span={4} className="item">
                                        <Dropdown
                                            trigger={['click']}
                                            overlay={
                                                <Menu
                                                    style={{backgroundColor: '#f6f4f1'}}
                                                    onClick={(event)=>{onAplicable(event?.key,index)}}
                                                >
                                                    <Menu.Item key={'Yes'}>
                                                        Yes
                                                    </Menu.Item>
                                                    <Menu.Item key={'No'}>
                                                        No
                                                    </Menu.Item>
                                                </Menu>
                                            }
                                        >
                                            <span className="mouse-pointer">{el.apply}</span>
                                        </Dropdown>
                                    </Col>
                                    <Col span={4} className="item">{ formatCurrency(el.amount) }</Col>
                                </Row>
                            </Col>)}
                            <Col span={16} className="label my-30">Adjustment</Col>
                            <Col span={8} className="item my-30" >
                                <Inputnumber
                                    value={adjustment}
                                    shape="$"
                                    onChange={(value)=>{setAdjustment(value??0)}}
                                />
                            </Col>
                            <Col span={16} className="label bold my-20"> Employee Hourly Buy Rate</Col>
                            <Col span={8} className="item bold my-20"> {formatCurrency(buyRate + adjustment)}</Col>
                            <Col span={12} className="label mb-10">Daily Billable Hours</Col>
                            <Col span={6}  className="item bold  mb-10"> 
                                <Inputnumber
                                    value={expectedDailyHours}
                                    onChange={(value)=>{setExpectedDailyHours(value??0)}}
                                />
                            </Col>
                            <Col span={16} className="label bold "> Employee Daily Buy Rate</Col>
                            <Col span={8} className="item bold total-cost pr-5"> {formatCurrency(expectedDailyHours * (buyRate + adjustment))}</Col>
                        </Row>
                    </Col>
                    <Col span={12} className="sell-cost">
                        <Row  >
                            <Col span={24} className="mb-10">
                                <Typography.Title level={5}>Sell Rate Calculator - Employee</Typography.Title>
                            </Col>
                            <Col span={7}>Expected CM %</Col>
                            {margin.map((el,index)=> <Col span={4} key={index}>
                                <Inputnumber
                                    value={el}
                                    max={100}
                                    shape="%"
                                    onChange={(value)=>onChangeMargin(value, index)}
                                />
                            </Col>
                            )}
                        </Row>
                        <Row align="bottom"> 
                            <Col span={8} className="label bold">Employee Daily Sell Rate</Col>
                            {margin.map((el,index)=> <Col span={4} className="bold" key={index}>
                                {formatCurrency((expectedDailyHours * (buyRate + adjustment))/(1- (el/100)))}
                            </Col>)}
                        </Row>
                    </Col>
                </Row>
            :
            <Row className="buy-sell-calculator " align="middle" justify="center" >
                <Col span={12} className="no-active">
                    <Typography.Text type="danger" mark>No Active Contract</Typography.Text>
                </Col>
                <Col span={12} className="no-active">
                    <Typography.Text type="danger" mark>No Active Contract</Typography.Text>
                </Col>
            </Row>
        } </div>
    )
}

function Inputnumber({value, shape, onChange, min, max}) {
    return <InputNumber 
        size="small"
        value={value}
        formatter={(value) => formatter(value, shape) }
        parser={(value) => parser(value, shape) }
        onChange={onChange}
        min={min}
        max={max}
    />
}

export default EmployeeCalculator