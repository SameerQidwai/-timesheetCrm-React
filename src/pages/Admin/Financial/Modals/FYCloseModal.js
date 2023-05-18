import React, { useEffect, useState } from 'react'
import { Form, Modal, message } from 'antd'
import FormItems from '../../../../components/Core/Forms/FormItems'
import { formatDate } from '../../../../service/constant';
import { closingFY } from '../../../../service/financial-year-apis';

const FYModal = ({ visible, close, callBack }) => {
    const [loading, setLoading] = useState();

    useEffect(() => {
        getData();
    }, []);

    const getData = async() => {
      let info = {}
      try{
        message.loading({ content: 'Getting Information', key: record.id}, 0);
        let {success, data} = await closingFY(record.id)
        message.warning({ content: 'Please Read The Action Carefully', key: record.id}, 5);
        if (success){
          info = data
        }
      }catch{
        console.log('this action cant be perform')
      }
    }

    const onConfirm = (record, index) => {
        
    };
}

export default FYModal