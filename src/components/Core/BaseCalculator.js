import React, { useEffect, useState } from "react";
import { Col, Descriptions, InputNumber, Row, Typography } from "antd";

import { buyCost } from "../../service/Employees";
import { formatCurrency, formatFloat, STATES } from "../../service/constant";
import '../Styles/buycost.css'
import moment from "moment";
import 'moment-weekday-calc';
import { formatter, parser } from "./Forms/FormItems";

const { Item } = Descriptions

const BaseCalculator = (props) =>{
    const [contract, setContract] = useState({})
    const [variables, setVariables] = useState([])
    const [holidays, setHolidays] = useState([])
    const [variableCount, setVariableCount] = useState(0)
    const [margin, setMargin] = useState([20, 25, 30, 40])
    const [adjustment, setAdjustment] = useState(0)
    useEffect(() => {
      buyCost(props.empId).then(res=>{
            if(res.success){
                let {contract, golobalVariables, holidays} = res.data
                let weekdays = []
                for (var i=0 ; i < contract.noOfDays ?? 5 ; i++){
                    weekdays.push(i+1);
                }
                let workdays = moment().isoWeekdayCalc({  
                    rangeStart: `1 Jul ${moment().format('YYYY')}`,  
                    rangeEnd: `31 Jun ${moment().add(1, 'y').format('YYYY')}`,  
                    weekdays: weekdays,  
                    exclusions: holidays,
                }) 
                contract.workDaysPerAnum = workdays
                contract.dailyHours = contract?.noOfHours / contract?.noOfDays
                contract.hourlyBaseRate = contract?.remunerationAmount / workdays / contract?.dailyHours
                let count = 0
                golobalVariables = golobalVariables.map((el, index)=> {
                    if (index === 0){
                        el.amount = contract?.hourlyBaseRate * el.value/100
                    }else{
                        el.amount = ((contract?.hourlyBaseRate + golobalVariables[0].value) * el.value )/100
                    }
                    count += el.amount
                    return el
                })
                setVariableCount(count)
                setContract(contract)
                setVariables(golobalVariables)
                setHolidays(holidays)
            }
      })
    
    }, [])

    

    const onChangeAdjustment = (value) =>{
        setAdjustment(value)
        setVariableCount(variableCount + (value??0))
    }

    const onChangeMargin = (value, index) =>{
        margin[index] = (value ?? 0)
        setMargin([...margin])
    }
    
    return ( 
        <Row className="buy-sell-calculator">
            <Col span={12} className="buy-cost calculator">
                <Row> 
                    <Col span={24} className="mb-10">
                        <Typography.Title level={5}>Buy Rate Calculator - Employee</Typography.Title>
                    </Col>
                    <Col span={16} className="label">Annual Base Salary</Col>
                    <Col span={8} className="item">{formatCurrency(contract?.remunerationAmount)}</Col>
                    <Col span={16}  className="label">Daily Hours</Col>
                    <Col span={8}  className="item">{formatFloat(contract?.dailyHours)}</Col>
                    <Col span={16}  className="label">{`Weekly Hours - (${contract?.dailyHours} * ${contract?.noOfDays} days)`}</Col>
                    <Col span={8}  className="item">{contract?.noOfHours}</Col>
                    {/* we are saving noOfHOurs in week in our databse so no need to show here */}
                    <Col span={16}  className="label">Billable Days per annum</Col>
                    <Col span={8}  className="item">{contract?.workDaysPerAnum}</Col>
                    <Col span={16}  className="label my-10" >
                        {`Hourly Base Rate - (${formatCurrency(contract?.remunerationAmount)}/${contract?.workDaysPerAnum}/${contract?.dailyHours})`}
                    </Col>
                    <Col span={5}  className="item my-10" ><Typography.Text underline strong >Applicable</Typography.Text></Col>
                    <Col span={3}  className="item my-10" >{formatCurrency(contract?.hourlyBaseRate)}</Col>
                    {variables.map((el, index)=>  <Col span={24} key={index}>
                        <Row>
                            <Col span={12} className="label">
                                { STATES[el.name]?
                                    `Payroll Tax - ${STATES[el.name]}`
                                :
                                    el.name}
                            </Col>
                            <Col span={6} className="item">{`${el.value}%`}</Col>
                            <Col span={6} className="item">{ formatCurrency(el.amount) }</Col>
                        </Row>
                    </Col>)}
                    <Col span={16} className="label my-30">Adjustment</Col>
                    <Col span={8} className="item my-30" >
                        <Inputnumber
                            value={adjustment}
                            shape="$"
                            onChange={onChangeAdjustment}
                        />
                    </Col>
                    <Col span={16} className="label bold my-20"> Employee Hourly Buy Rate</Col>
                    <Col span={8} className="item bold my-20"> {formatCurrency(variableCount)}</Col>
                    <Col span={12} className="label">Daily Billable Hours</Col>
                    <Col span={6}  className="item bold"> {formatFloat(contract?.dailyHours)}</Col>
                    <Col span={16} className="label bold"> Employee Daily Buy Rate</Col>
                    <Col span={8} className="item bold"> {formatCurrency(contract?.dailyHours * variableCount)}</Col>
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
                        {formatCurrency((contract?.dailyHours * variableCount)/(1- (el/100)))}
                    </Col>)}
                </Row>
            </Col>
        </Row>
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

export default BaseCalculator