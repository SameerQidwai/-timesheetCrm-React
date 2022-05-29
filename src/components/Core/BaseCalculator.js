import React, { useEffect, useState } from "react";
import { Col, Descriptions, Input, InputNumber, Row, Typography } from "antd";

import { buyCost } from "../../service/Employees";
import { formatCurrency, STATES } from "../../service/constant";
import '../Styles/buycost.css'
import moment from "moment";
import 'moment-weekday-calc';
import { formatter, parser } from "./Forms/FormItems";

const { Item } = Descriptions


const BaseCalculator = (props) =>{
    const [contract, setContract] = useState({})
    const [variables, setVariables] = useState([])
    const [holidays, setHolidays] = useState([])
    useEffect(() => {
      buyCost(props.empId).then(res=>{
            if(res.success){
                const {contract, golobalVariables, holidays} = res.data
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
                setContract(contract)
                setVariables(golobalVariables)
                setHolidays(holidays)
            }
      })
    
    }, [])

    const Input = (value, shape) =>{
        return <InputNumber 
            size="small"
            value={value}
            formatter={(value) => formatter(value, shape) }
            parser={(value) => parser(value, shape) }
        />
    }

    
    return ( 
        <Row className="buy-sell-calculator">
            <Col span={10} className="buy-cost calculator">
                <Row> 
                    <Col span={24} className="mb-10">
                        <Typography.Title level={5}>Buy Rate Calculator - Employee</Typography.Title>
                    </Col>
                    <Col span={16} className="label">Annual Base Salary</Col>
                    <Col span={8} className="item">{formatCurrency(contract?.remunerationAmount)}</Col>
                    <Col span={16}  className="label">Daily Hours</Col>
                    <Col span={8}  className="item">{contract?.dailyHours}</Col>
                    <Col span={16}  className="label">{`Weekly Hours - (${contract?.dailyHours} * ${contract?.noOfDays} days)`}</Col>
                    <Col span={8}  className="item">{contract?.noOfHours}</Col>
                    {/* we are saving noOfHOurs in week in our databse so no need to show here */}
                    <Col span={16}  className="label">Billable Days per annum</Col>
                    <Col span={8}  className="item">{contract?.workDaysPerAnum}</Col>
                    <Col span={16}  className="label my-10" >
                        {`Hourly Base Rate - (${formatCurrency(contract?.remunerationAmount)}/${contract?.workDaysPerAnum}/${contract?.dailyHours})`}
                    </Col>
                    <Col span={8}  className="item my-10" >{formatCurrency(contract?.hourlyBaseRate)}</Col>
                    {variables.map(el=> <Col span={24}>
                        <Row>
                            <Col span={12} className="label">
                                { STATES[el.name]?
                                    `Payroll Tax - ${STATES[el.name]}`
                                :
                                    el.name}
                            </Col>
                            <Col span={6} className="item">{`${el.value}%`}</Col>
                            <Col span={6} className="item">{formatCurrency((contract?.hourlyBaseRate * el.value)/100)}</Col>
                        </Row>
                        </Col>)
                    }
                    <Col span={16} className="label my-30">Adjustment</Col>
                    <Col span={8} className="item my-30" >{Input(4, '$')}</Col>
                    <Col span={16} className="label bold my-20"> Employee Hourly Buy Rate</Col>
                    <Col span={8} className="item bold my-20"> {formatCurrency(100)}</Col>
                    <Col span={12} className="label">Daily Billable Hours</Col>
                    <Col span={6}  className="item bold"> {formatCurrency(100)}</Col>
                    <Col span={16} className="label bold"> Employee Daily Buy Rate</Col>
                    <Col span={8} className="item bold"> {formatCurrency(852.10)}</Col>
                </Row>
            </Col>
            <Col span={12} className="sell-cost">
                <Row  >
                    <Col span={24} className="mb-10">
                        <Typography.Title level={5}>Sell Rate Calculator - Employee</Typography.Title>
                    </Col>
                    <Col span={7}>Expected CM %</Col>
                    <Col span={4}>{Input(24, '%')}</Col>
                    <Col span={4}>{Input(24, '%')}</Col>
                    <Col span={4}>{Input(24, '%')}</Col>
                    <Col span={4}>{Input(24, '%')}</Col>
                </Row>
                <Row align="bottom"> 
                    <Col span={8} className="label bold">Employee Daily Sell Rate</Col>
                    <Col span={4} className="bold">{formatCurrency(1060.17)}</Col>
                    <Col span={4} className="bold">{formatCurrency(1060.17)}</Col>
                    <Col span={4} className="bold">{formatCurrency(1060.17)}</Col>
                    <Col span={4} className="bold">{formatCurrency(1060.17)}</Col>
                </Row>
            </Col>
        </Row>
    )
}

export default BaseCalculator