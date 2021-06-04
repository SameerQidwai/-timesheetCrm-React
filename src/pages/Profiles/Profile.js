import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import PersonalDetails from './PersonalDetails'
import PersonalContract from './Contract'
import PasswordUpdate from './PasswordUpdate'
import { getRecord } from '../../service/Employees'
import OtherDetails from './OtherDetails'

const { TabPane } = Tabs
const Profile = ()=>{
    const [basic, setBasic] = useState(false)
    const [contract, setContract] = useState(false)
    const [details, setDetails] = useState(false)

    useEffect(() => {
        getData()
    }, [])
    const getData = () =>{
        getRecord(3).then(res=>{
            if(res.success){
                console.log(res);
                setBasic(res.basic)
                setContract(res.billing)
                setDetails({train:res.train, kin: res.kin, detail: res.detail, bank: res.bank})
            }
        })
    }
    return (
        <Tabs type="card" defaultActiveKey="others">
            <TabPane tab="Personal Details" key="personal">
                {basic&& <PersonalDetails data={basic}/>}
            </TabPane>
            <TabPane tab="Contract" key="contract"> 
                {contract &&<PersonalContract data={contract} />} 
            </TabPane>
            <TabPane tab="Other Details" key="others"> {details && <OtherDetails  data={details}/>} </TabPane>
            <TabPane tab="Password" key="password "> <PasswordUpdate password={basic.password}/> </TabPane>
        </Tabs>
    )
}

export default Profile