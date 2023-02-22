import React, { useEffect, useState } from "react";
import { Col, Dropdown, InputNumber, Menu, Row, Typography } from "antd";
import 'moment-weekday-calc';

import '../../Styles/buycost.css'
// import { formatFloat } from "../../../service/constant";
import { formatCurrency, formatFloat, getFiscalYear, formatDate, STATES } from "../../../service/constant";
import { buyCost } from "../../../service/constant-Apis";
import { formatter, parser } from "../Forms/FormItems";


export const PermanentCalculator = (props) => {

    const [variables, setVariables] = useState([])
    const [contract, setContract] = useState({
        rfqt: null,
        margin: 0,
        cm1: 0,
        cm2: 0,
        cm3: 0,
        cm4: 0,
        dailyHours: 0,
        weaklyHours: 0,
        pWeekDays : 5,
        gst:11
    });

    const [core, setCore] = useState({
        dlrGst: 0,
        dlrMargin: 0,
        cm1: 0,
        cm2: 0,
        cm3: 0,
        cm4: 0
    });
    
    useEffect(() => {
        let fiscalYear = getFiscalYear('years')
        
        buyCost('employees', 1).then(res=>{
            if(res.success){
                let {golobalVariables, employeeBuyRate} = res.data
                /** calculating noOfDays from contract not in use  */
                // let weekdays = []
                // for (var i=0 ; i < contract.noOfDays ?? 5 ; i++){
                //     weekdays.push(i+1);
                // }
                /** noOfDays are now fixed 5 days a week throughout year */
                /** Not In use put it here just in case */
                // let workdays = formatDate(new Date()).isoWeekdayCalc({  
                //     rangeStart: `1 July ${fiscalYear['start']}`,  
                //     rangeEnd: `30 June ${fiscalYear['end']}`,
                //     weekdays: weekdays,  
                //     // exclusions: holidays,
                // }) 
                /**will remove isoWeekdayCalc later  and put constant workDaysPerAnum*/

                // contract.workDaysPerAnum = workdays
                // contract.dailyHours = contract?.noOfHours / contract?.noOfDays
                // contract.hourlyBaseRate = (contract.type=== 1 ? 
                //     contract?.remunerationAmount : 
                //     (contract?.remunerationAmount / 52 / contract?.noOfHours)
                // ) /** hourlyBaseRate expression Annual hours / 52 * weekly hours  */
                    /** 52 is a number of weeks in a year, noOfHours are weekly our  */
                // let count = 0
                // golobalVariables = golobalVariables.map((el, index)=> {
                //     if (index === 0){
                //         el.amount = contract?.hourlyBaseRate * el?.value/100
                //     }else{
                //         el.amount = ((contract?.hourlyBaseRate + golobalVariables?.[0].amount) * el.value )/100
                //     }
                //     el.apply = 'Yes'
                //     count += el.amount
                //     return el
                // })
                // setBuyRate(employeeBuyRate)
                // setContract(contract)
                setVariables(golobalVariables)
            }
      })
    
    }, [])

    const onAplicable = (value, index) =>{
        // let changeVariables = variables 
        // changeVariables[index]['apply'] = value
        // let count = contract.hourlyBaseRate
        // changeVariables = changeVariables.map((el, index)=> {
        //     if (index === 0){// if applicable              // caluclation                     
        //         el.amount = el.apply === 'Yes' ? (contract?.hourlyBaseRate * el.value/100) : 0
        //     }else{           // if applicable              // caluclation             
        //         el.amount = el.apply === 'Yes' ? (((contract?.hourlyBaseRate + changeVariables[0].amount) * el.value )/100) : 0
        //     }
        //     count += el.amount
        //     return el
        // })
        // // setBuyRate(count)
        // setVariables([...changeVariables])
    }

    // SOME FUNCTIONS 
    const findDlrGst = (gst, rfqt) => {
        let val = (rfqt/gst) - rfqt;
        setCore(core => ({    
            ...core, dlrGst : val ?? 0             
        }));
    }

    const findDslMArgin = (dlrGst,margin) => {
        let val = (dlrGst * margin) - dlrGst;
        setCore(core => ({    
            ...core, dlrMargin : val ?? 0             
        }));
    }

    const dbrOffer = (dlrMargin, value, cm) => {
        let val = dlrMargin * (1 - value);
        setCore(core => ({    
            ...core, [cm] : val ?? 0             
        }));
    }
    
    return (
        <div>
            <Row className="buy-sell-calculator">
                <Col span={24} className="buy-cost calculator">
                    <Row> 
                        <Col span={24} className="mb-10">
                            <Typography.Title level={5}>Buy Rate Calculator - Employee(Permanent)</Typography.Title>
                        </Col>                 {/**for casual type emp we already set hourly base salary */}
                        {/* <Col span={16} className="label">{contract.type=== 1 ? 'Hourly Base Salary' :'Annual Base Salary'}</Col> */}
                        <Col span={6} className="label bold">{'Daily Sell Rate inc. GST-per RFQTS'}</Col>
                        <Col span={6}></Col>
                        <Col span={3} className="item" >
                            <Inputnumber
                                value={contract.rfqt}
                                shape="$"
                                onChange={(value) => {
                                    setContract(contract => ({
                                        ...contract, rfqt: value ?? 0
                                    }))
                                    findDlrGst(contract?.gst, value ?? 0)
                                }}
                            />
                        </Col>
                        <Col span={9}></Col>
                        {/* <Col span={8} className="item">{formatCurrency(contract?.remunerationAmount)}</Col> */}
                        <Col span={6}  className="label">Daily Sell Rate ex GST (110/10)</Col>
                        <Col span={3}  className="item">{formatFloat(contract.gst)}</Col>
                        <Col span={3}  className="item"></Col>
                        <Col span={3} className="item"> {formatCurrency(core.dlrGst)}
                        </Col>
                        <Col span={9}  className="item"></Col>
                        {/* <Col span={8}  className="item">{formatFloat(contract?.dailyHours)}</Col> */}
                        <Col span={6}  className="label">Daily Sell Rate ex Panel Provider Margin</Col>
                        <Col span={3} className="item">
                        <Inputnumber
                                value={contract.margin}
                                onChange={(value)=>{setContract(contract => ({
                                        ...contract, margin: value ?? 0
                                    }))
                                    findDslMArgin(core.dlrGst, value?? 0)
                                }}
                                shape="%"
                            />
                        </Col>
                        <Col span={3} className="item"></Col>
                        <Col span={3} className="item"> {formatCurrency(core.dlrMargin)}</Col>
                        <Col span={9} className="item"></Col>
                        {/* we are saving noOfHOurs in week in our databse so no need to show here */}
                        <Col span={11} offset={1} className="label bold">Expected CM %</Col>
                        <Col span={3} className="item">
                            <Inputnumber
                                value={contract.c1}
                                onChange={(value)=>{setContract(contract => ({
                                        ...contract, cm1: value ?? 0
                                    }))
                                    dbrOffer(core.dlrMargin,value,"cm1")
                                }}
                                shape="%"
                            />
                        </Col>
                        <Col span={3} className="item">
                            <Inputnumber
                                value={contract.cm2}
                                onChange={(value)=>{setContract(contract => ({
                                        ...contract, cm2: value ?? 0
                                    }))
                                    dbrOffer(core.dlrMargin,value,"cm2")
                                }}
                                shape="%"
                            />
                        </Col>
                        <Col span={3} className="item">
                            <Inputnumber
                                value={contract.c3}
                                onChange={(value)=>{setContract(contract => ({
                                        ...contract, cm3: value ?? 0
                                    }))
                                    dbrOffer(core.dlrMargin,value,"cm3")
                                }}
                                shape="%"
                            />
                        </Col>
                        <Col span={3} className="item">
                            <Inputnumber
                                value={contract.cm4}
                                onChange={(value)=>{setContract(contract => ({
                                        ...contract, cm4: value ?? 0
                                    }))
                                    dbrOffer(core.dlrMargin,value,"cm4")
                                }}
                                shape="%"
                            />
                        </Col>
                        <Col span={24} className="label my-30"></Col>
                        {/* offer */}
                        <Col span={12} className="label bold">Daily Buy Rate available to offer</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(core.cm1)}</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(core.cm2)}</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(core.cm3)}</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(core.cm4)}</Col>
                        
                        <Col span={6} className="label">Project Daily Hours</Col>
                        <Col span={3} className="item"></Col>
                        <Col span={3} className="item bold  mb-10"> 
                        <Inputnumber
                            value={contract.dailyHours}
                                onChange={(value) => {
                                    setContract(contract => ({
                                        ...contract, dailyHours: value ?? 0
                                    }))
                                }}
                            />
                        </Col>
                        <Col span={12} className="item"></Col>
                        <Col span={6} className="label">Project Weekly Hours</Col>
                        <Col span={3} className="label item">{`${contract.dailyHours} * ${contract.pWeekDays}`}</Col>
                        <Col span={3} className="label item">{formatCurrency(contract.dailyHours*contract.pWeekDays)}</Col>
                        
                        <Col span={24} className="label my-30"></Col>
                        
                        <Col span={12} className="label bold ">Hourly Rate including On-cost</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(98.33)}</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(98.33)}</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(98.33)}</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(98.33)}</Col>
                        
                        <Col span={4} offset={8} className=""><Typography.Text underline strong >Applicable</Typography.Text></Col>
                        <Col span={12} className="item" ></Col>
                        <Col span={12}>
                            {variables.map((el, index)=>  <Col span={24} key={index}>
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
                        </Col>
                        <Col span={12} className="item" ></Col>
                        <Col span={24}>      
                            <Col span={10} offset={2}>      
                                <Row>
                                    <Col span={12} className="label bold my-20"> Total On-cost Ratio</Col>
                                    <Col span={12} className="bold my-20"> {1}</Col>
                                </Row>
                            </Col>
                        </Col>
                        {/* <Col span={8} className="item bold my-20"> {formatCurrency(buyRate + adjustment)}</Col> */}
                        <Col span={12} className="label bold my-20"> Hourly Base Rate</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(98.33)}</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(98.33)}</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(98.33)}</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(98.33)}</Col>
                        {/* <Col span={8} className="item bold my-20"> {formatCurrency(buyRate + adjustment)}</Col> */}
                        <Col span={24}>
                            <Row>  
                                <Col span={7} offset={1} className="label">Weekly Hours - Standard Employment Contract</Col>
                                <Col span={4}  className="item bold "> 
                                    <Inputnumber
                                        value={contract.weaklyHours}
                                        onChange={(value) => {
                                            setContract(contract => ({
                                                ...contract, weaklyHours: value ?? 0
                                            }))
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24}>
                            <Row>
                                <Col span={7} offset={1} className="label"> Week in a Year</Col>
                                <Col span={4} className="item"> {52}</Col>
                            </Row>
                        </Col>
                        <Col span={12} className="label bold my-20">Annual Base Salary</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(98.33)}</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(98.33)}</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(98.33)}</Col>
                        <Col span={3} className="item bold my-20"> {formatCurrency(98.33)}</Col>
                        {/* <Col span={8} className="item bold total-cost pr-5"> {formatCurrency(expectedDailyHours * (buyRate + adjustment))}</Col> */}
                    </Row>
                </Col>
                {/* <Col span={12} className="sell-cost">
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
                </Col> */}
            </Row>
            
            {/* //: */}
            {/* <Row className="buy-sell-calculator " align="middle" justify="center" >
                <Col span={12} className="no-active">
                    <Typography.Text type="danger" mark>No Active Contract</Typography.Text>
                </Col>
                <Col span={12} className="no-active">
                    <Typography.Text type="danger" mark>No Active Contract</Typography.Text>
                </Col>
            </Row> */}
        </div>
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

// export PermanentCalculator