import React, { useEffect, useState } from "react";
import { Col, Dropdown, InputNumber, Menu, Row, Typography } from "antd";

import { formatCurrency, formatFloat, STATES } from "../../../service/constant";

import { formatter, parser } from "../Forms/FormItems";
import { buyCost } from "../../../service/contractors";

import '../../Styles/buycost.css'


const ContractorCalculator = (props) =>{
    const [contract, setContract] = useState({})
    const [variables, setVariables] = useState([])
    const [variableCount, setVariableCount] = useState(0)
    const [margin, setMargin] = useState([20, 25, 30, 40])
    const [adjustment, setAdjustment] = useState(0)
    const [expectedDailyHours, setExpectedDailyHours ] = useState(8.00)
    useEffect(() => {
      buyCost(props.conId).then(res=>{
            if(res.success){
                let {contract, golobalVariables} = res.data

                contract.dailyHours = contract?.noOfHours / contract?.noOfDays
                contract.hourlyBaseRate = ( //HOURLY RATE
                    contract.remunerationAmountPer === 1 ? contract?.remunerationAmount
                    :  //DAILY RATE
                    contract.remunerationAmountPer === 2 ? (contract?.remunerationAmount * contract.dailyHours)
                    : //WEEKLY RATE
                    contract.remunerationAmountPer === 3 ? (contract?.remunerationAmount * contract?.noOfHours)
                    : //FORTNIGLTY RATE
                    contract.remunerationAmountPer === 4 ? (contract?.remunerationAmount * (contract?.dailyHours * 11))
                    : //MONTHLY RATE
                    contract.remunerationAmountPer === 5 && (contract?.remunerationAmount * (contract?.dailyHours * 22))
                )
                let count = 0
                golobalVariables = golobalVariables.map((el, index)=> {
                    if (index === 0){
                        el.amount = contract?.hourlyBaseRate * el.value/100
                    }else{
                        el.amount = ((contract?.hourlyBaseRate + golobalVariables[0].amount) * el.value )/100
                    }
                    el.apply = 'Yes'
                    count += el.amount
                    return el
                })
                setVariableCount(count + contract?.hourlyBaseRate)
                setContract(contract)
                setVariables(golobalVariables)
            }
      })
    
    }, [])

    

    const onChangeAdjustment = (value) =>{
        setAdjustment(value??0)
    }

    const onChangeMargin = (value, index) =>{
        margin[index] = (value ?? 0)
        setMargin([...margin])
    }

    const onAplicable = (value, index) =>{
        let changeVariables = variables 
        changeVariables[index]['apply'] = value
        let count = 0
        changeVariables = changeVariables.map((el, index)=> {
            if (index === 0){// if applicable              // caluclation                     
                el.amount = el.apply === 'Yes' ? (contract?.hourlyBaseRate * el.value/100) : 0
            }else{           // if applicable              // caluclation             
                el.amount = el.apply === 'Yes' ? (((contract?.hourlyBaseRate + changeVariables[0].amount) * el.value )/100) : 0
            }
            count += el.amount
            return el
        })
        setVariableCount(count + contract?.hourlyBaseRate)
        setVariables([...changeVariables])
    }
    
    return ( 
        <Row className="buy-sell-calculator">
            <Col span={12} className="buy-cost calculator">
                <Row> 
                    <Col span={24} className="mb-10">
                        <Typography.Title level={5}>Buy Rate Calculator - Contractor</Typography.Title>
                    </Col>
                    <Col span={16} className="label">Daily Hours</Col>
                    <Col span={8} className="item">{formatFloat(contract?.dailyHours)}</Col>
                    <Col span={16}  className="label">Hourly Cost</Col>
                    <Col span={8}  className="item">{formatCurrency(contract?.hourlyBaseRate)}</Col>
                    <Col span={5} offset={16} className="item" ><Typography.Text underline strong >Applicable</Typography.Text></Col>
                    {variables.map((el, index)=>  <Col span={24} key={index}>
                        <Row>  {/**there will be only one element but for now I am letting it stay here...  */}
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
                            onChange={onChangeAdjustment} 
                        />
                    </Col>
                    <Col span={16} className="label bold my-20"> Contractor Hourly Buy Rate</Col>
                    <Col span={8} className="item bold my-20"> {formatCurrency(variableCount + adjustment)}</Col>
                    <Col span={12} className="label mb-10">Daily Billable Hours</Col>
                    <Col span={6}  className="item bold mb-10"> 
                        <Inputnumber
                            value={expectedDailyHours}
                            shape="$"
                            onChange={(value)=>{setExpectedDailyHours(value??0)}}
                        />
                    </Col>
                    <Col span={16} className="label bold"> Contractor Daily Buy Rate</Col>
                    <Col span={8} className="item bold total-cost pr-5"> {formatCurrency(expectedDailyHours * (variableCount + adjustment))}</Col>
                </Row>
            </Col>
            <Col span={12} className="sell-cost">
                <Row  >
                    <Col span={24} className="mb-10">
                        <Typography.Title level={5}>Sell Rate Calculator - Contractor </Typography.Title>
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
                    <Col span={8} className="label bold">Contractor Daily Sell Rate</Col>
                    {margin.map((el,index)=> <Col span={4} className="bold" key={index}>
                        {formatCurrency((expectedDailyHours * (variableCount + adjustment))/(1- (el/100)))}
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

export default ContractorCalculator