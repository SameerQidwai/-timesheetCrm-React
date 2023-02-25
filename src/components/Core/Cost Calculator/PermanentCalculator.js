import React, { useEffect, useState } from "react";
import { Col, Dropdown, InputNumber, Menu, Row, Select, Typography } from "antd";
import 'moment-weekday-calc';

import '../../Styles/buycost.css'
// import { formatFloat } from "../../../service/constant";
import { formatCurrency, formatFloat, getFiscalYear, formatDate, STATES } from "../../../service/constant";
import { buyCost, getReverseCostCal } from "../../../service/constant-Apis";
import { formatter, parser } from "../Forms/FormItems";


export const PermanentCalculator = (props) => {
    let { path } = props.match;
    path = path.replaceAll('/calculator-', '')
    
    function checkPath(){
        if (path === "permanent") {
            return 1;
        } else if (path === "casual") {
            return 2;
        } else {
            return 3;
        }
    }

    const [whichPath, setWhichPath] = useState(checkPath());
    const [empType, setEmpType] = useState(path.charAt(0).toUpperCase() + path.slice(1));
    const [variables, setVariables] = useState([])
    // const [totalCostRatio, setTotalCr] = useState(0)
    const [contract, setContract] = useState({
        rfqt: 0,
        margin: 0,
        gst: 0,
        cm1: 20,
        cm2: 25,
        cm3: 30,
        cm4: 40,
        dailyHours: 0,
        weaklyHours: 0,
        pWeekDays : 5,
        hourlyBaseRate: 0.9,
        weekInYear: empType === "Permanent" ? 52 : 8,
        stateTax: []
    });

    useEffect(() => {
        let fiscalYear = getFiscalYear('years')
     
        getReverseCostCal(whichPath).then(res=>{
            if(res.success){
                let { gst, golobalVariables, stateTax } = res.data
                contract.gst = (gst + 100) / gst;
                contract.stateTax = stateTax;
                contract.selectedState = stateTax?.[0]?.valueId;
                setContract(contract);
                let value = {
                    name: "Payroll Tax",
                    value: stateTax?.[0]?.value,
                    apply: 'Yes'
                };
                golobalVariables.splice(1, 0, value);
                setVariables(golobalVariables)
            }
      })
    }, [])

    const onAplicable = (key, index) => {
        let changeVariables = variables;
        changeVariables[index]['apply'] = key;
        setVariables([...changeVariables]);
    }
    
    const sumValue = () => {
        let val = 0;
        variables.map((ele) => {
            if (ele.apply === "Yes") {
                val += ele.value
            }
        })
        return val;
    }
    console.log(variables.length);
    const handleChange = (value) => {
        setContract(contract => ({
            ...contract, selectedState: contract?.stateTax[value-1]?.valueId
        }));
        let valueId = contract?.stateTax[value - 1];
        value = {
            name: "Payroll Tax",
            value: valueId?.value,
            apply: 'Yes'
        };
        (variables.length === 1) ? variables[0] = value : variables[1] = value;
        setVariables(variables)
    }

    // SOME FUNCTIONS 
    const findDlrGst = () => {
        const {gst, rfqt} = contract
        return (rfqt/gst) - rfqt;
    }

    const findDslMArgin = () => {
        const { margin } = contract
        return (findDlrGst() * (margin/100)) - findDlrGst()
    }

    const findDbrOffer = (value) => {
        return findDslMArgin() * (1 - (value/100));
    }

    const calTotalCostRatio = (value) => {
        return (findDbrOffer(value)/contract.dailyHours)/((1*(sumValue()/100))+1)
    }

    const calABSalaryforPerma = (value) => {
        return ((calTotalCostRatio(value) * contract.weaklyHours) * contract.weekInYear)
    }

    const calABSalary = (value) => {
        return (calTotalCostRatio(value) * contract.weekInYear)
    }
    const decideCalType = (value) => {
        return (empType === "Permanent") ? calABSalaryforPerma(value) : calABSalary(value)
    }
    return (
        <Row>
            <Col span={16}>
                <Row className="buy-sell-calculator">
                    <Col span={24} className="buy-cost calculator">
                        <Row> 
                            <Col span={24} className="mb-10">
                                <Typography.Title level={5}>Buy Rate Calculator - {(empType == 'Contractor') ? `Sub(${empType})` : `Employee(${empType})`}</Typography.Title>
                            </Col>                 {/**for casual type emp we already set hourly base salary */}
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
                                        // findDlrGst(contract?.gst, value ?? 0)
                                    }}
                                />
                            </Col>
                            <Col span={9}></Col>
                            <Col span={6}  className="label">Daily Sell Rate ex GST (110/10)</Col>
                            <Col span={3}  className="item">{formatFloat(contract.gst)}</Col>
                            <Col span={3}  className="item"></Col>
                            <Col span={3} className="item"> {formatCurrency(findDlrGst())}
                            </Col>
                            <Col span={9}  className="item"></Col>
                            <Col span={6}  className="label">Daily Sell Rate ex Panel Provider Margin</Col>
                            <Col span={3} className="item">
                            <Inputnumber
                                    value={contract.margin}
                                    onChange={(value)=>{setContract(contract => ({
                                            ...contract, margin: value ?? 0
                                        }))
                                        // findDslMArgin(core.dlrGst, value?? 0)
                                    }}
                                    shape="%"
                                />
                            </Col>
                            <Col span={3} className="item"></Col>
                            <Col span={3} className="item"> {formatCurrency(findDslMArgin())}</Col>
                            <Col span={9} className="item"></Col>
                            {/* we are saving noOfHOurs in week in our databse so no need to show here */}
                            <Col span={11} offset={1} className="label bold">Expected CM %</Col>
                            <Col span={3} className="item">
                                <Inputnumber
                                    value={contract.cm1}
                                    onChange={(value)=>{setContract(contract => ({
                                            ...contract, cm1: value ?? 0
                                        }))
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
                                    }}
                                    shape="%"
                                />
                            </Col>
                            <Col span={3} className="item">
                                <Inputnumber
                                    value={contract.cm3}
                                    onChange={(value)=>{setContract(contract => ({
                                            ...contract, cm3: value ?? 0
                                        }))
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
                                    }}
                                    shape="%"
                                />
                            </Col>
                            <Col span={24} className="label"></Col>
                            {/* offer */}
                            <Col span={12} className="label bold my-20">Daily Buy Rate available to offer</Col>
                            <Col span={3} className="item bold my-20"> {formatCurrency(findDbrOffer(contract.cm1))}</Col>
                            <Col span={3} className="item bold my-20"> {formatCurrency(findDbrOffer(contract.cm2))}</Col>
                            <Col span={3} className="item bold my-20"> {formatCurrency(findDbrOffer(contract.cm3))}</Col>
                            <Col span={3} className="item bold my-20"> {formatCurrency(findDbrOffer(contract.cm4))}</Col>
                            
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
                            <Col span={3} className="label">{`${contract.dailyHours} * ${contract.pWeekDays}`}</Col>
                            <Col span={3} className="label item">{contract.dailyHours*contract.pWeekDays}</Col>
                            
                            <Col span={24} className="label my-20"></Col>
                            <Col span={24} className="label">
                                <Col span={12}>
                                    <Row>
                                        <Col span={12}>
                                            Select State
                                        </Col>
                                        <Col span={12} className="item">
                                        <Select
                                            value={contract?.selectedState}
                                            fieldNames={{ label: 'label', value: 'valueId'}}
                                            style={{
                                            width: 200,
                                            }}
                                            onChange={handleChange}
                                            // options={contract.stateTax}
                                            options={
                                                (contract.stateTax || []).map((d,ind) => ({
                                                    value: d.value,
                                                    valueId: d.valueId,
                                                    label: d.label,
                                                    key: ind
                                                }))
                                            }
                                        />
                                        </Col>
                                    </Row>
                                </Col>
                            </Col>
                            <Col span={24} className="label my-20"></Col>
                            
                            <Col span={12} className="label bold">Hourly Rate including On-cost</Col>
                            <Col span={3} className="item bold"> {formatCurrency(findDbrOffer(contract.cm1)/contract.dailyHours)}</Col>
                            <Col span={3} className="item bold"> {formatCurrency(findDbrOffer(contract.cm2)/contract.dailyHours)}</Col>
                            <Col span={3} className="item bold"> {formatCurrency(findDbrOffer(contract.cm3)/contract.dailyHours)}</Col>
                            <Col span={3} className="item bold"> {formatCurrency(findDbrOffer(contract.cm4)/contract.dailyHours)}</Col>
                            
                            <Col span={3} offset={9} className="item"><Typography.Text underline strong >Applicable</Typography.Text></Col>
                            <Col span={12} className="item" ></Col>
                            <Col span={12}>
                                {variables?.map((el, index)=>  <Col span={24} key={index}>
                                    <Row>
                                        <Col span={16} className="label">
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
                                     </Row>
                                </Col>)}
                            </Col>
                            <Col span={12} className="item" ></Col>
                            <Col span={24}>      
                                <Col span={10} offset={2}>      
                                    <Row>
                                        <Col span={12} className="label bold my-20"> Total On-cost Ratio</Col>
                                        <Col span={12} className="bold my-20">{sumValue()}</Col>
                                    </Row>
                                </Col>
                            </Col>
                            <Col span={12} className="label bold"> Hourly Base Rate</Col>
                            <Col span={3} className="item bold"> {formatCurrency(calTotalCostRatio(contract.cm1))}</Col>
                            <Col span={3} className="item bold"> {formatCurrency(calTotalCostRatio(contract.cm2))}</Col>
                            <Col span={3} className="item bold"> {formatCurrency(calTotalCostRatio(contract.cm3))}</Col>
                            <Col span={3} className="item bold"> {formatCurrency(calTotalCostRatio(contract.cm4))}</Col>
                            {(empType === "Permanent") && <Col span={24}>
                                <Row>
                                    <Col span={7} offset={1} className="label">Weekly Hours - Standard Employment Contract</Col>
                                    <Col span={4} className="item bold ">
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
                            </Col>}
                            <Col span={24}>
                                <Row>
                                    <Col span={7} offset={1} className="label"> {(empType === "Permanent") ? `Week in a Year` : `Daily Hours in a Day`}</Col>
                                    <Col span={4} className="item"> {contract?.weekInYear}</Col>
                                </Row>
                            </Col>
                            <Col span={12} className="label bold">Annual Base Salary</Col>
                            <Col span={3} className="item bold"> {formatCurrency(decideCalType(contract.cm1))}</Col>
                            <Col span={3} className="item bold"> {formatCurrency(decideCalType(contract.cm2))}</Col>
                            <Col span={3} className="item bold"> {formatCurrency(decideCalType(contract.cm3))}</Col>
                            <Col span={3} className="item bold"> {formatCurrency(decideCalType(contract.cm4))}</Col>
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
            </Col>
            
            {/* //: */}
            {/* <Row className="buy-sell-calculator " align="middle" justify="center" >
                <Col span={12} className="no-active">
                    <Typography.Text type="danger" mark>No Active Contract</Typography.Text>
                </Col>
                <Col span={12} className="no-active">
                    <Typography.Text type="danger" mark>No Active Contract</Typography.Text>
                </Col>
            </Row> */}
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

// export PermanentCalculator