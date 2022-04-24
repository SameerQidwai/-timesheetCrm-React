import React from 'react'
import { Modal } from 'antd'

const AuthError = ({history}) =>{
    const error= () =>{
        Modal.error({
          title: 'Not Authorized!',
          content: "You don't have permission to view this Information",
          okText: 'Go Back',
          okType: 'danger',
          onOk: ()=> { 
            if(!history.goBack()){
              history.push('/profile')
            }
          }
        });
      }
    return <div>{error()}</div>
}

export default AuthError