import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import PersonalDetails from './PersonalDetails'
import PersonalContract from './Contract'
import PasswordUpdate from './PasswordUpdate'
import OtherDetails from './OtherDetails'
import SecurityClearance from './SecurityClearance'
import ResourceSkills from './ResourceSkills'

import { getSettings } from '../../service/Login-Apis'
import Attachments from '../../components/Core/Attachments'
import { localStore } from '../../service/constant'

const { TabPane } = Tabs
const Profile = ()=>{
    const [basic, setBasic] = useState(false)
    const [contract, setContract] = useState(false)
    const [details, setDetails] = useState(false)
    const [clearance, setClearance] = useState(false)
    const [resourceSkill, setresourceSkill] = useState(false)
    const loginType = JSON.parse(localStore().role).type

    useEffect(() => {
        getData()
    }, [])

    const getData = () =>{
        getSettings().then(res=>{
            if(res && res.success){
                setBasic(res.basic)
                setContract(res.billing)
                setDetails({
                    kin: res.kin, 
                    detail: res.detail, 
                    bank: res.bank,
                    // train:res.train, 
                })
                setClearance(res.sClearance)
                setresourceSkill(res.resourceSkill)
            }
        })
    }
    return (
        <Tabs type="card" defaultActiveKey="personal">
            <TabPane tab="Personal Details" key="personal">
                {basic && <PersonalDetails data={basic}/>}
            </TabPane>
            {loginType ==='Employee' &&<TabPane tab="Contract" key="contract"> 
                {contract &&<PersonalContract data={contract} />} 
            </TabPane>}
            <TabPane tab="Other Details" key="others"> {details && <OtherDetails  data={details}/>} </TabPane>
            <TabPane tab="Security Clearance" key="security"> {details && <SecurityClearance  data={clearance}/>} </TabPane>
            <TabPane tab="Password" key="password "> <PasswordUpdate/> </TabPane>
            {/* <TabPane tab="SKills" key="skills"> <ResourceSkills  data={resourceSkill} /> </TabPane> */}
            <TabPane tab="Attachments" key="attachments"> <Attachments targetType="emp" targetId={localStore().id}  /> </TabPane>
        </Tabs>
    )
}

export default Profile