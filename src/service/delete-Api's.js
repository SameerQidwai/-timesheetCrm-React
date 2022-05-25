import axios from "axios";
import { message as messageAlert } from "antd";
import { Api, apiErrorRes, headers, jwtExpired, setToken,  } from "./constant";

// history: to change page if necessary
// url: deleting api from 
// id: to delete from entries
// index: to delete from page data
// filterData: remove from filterData viewing on data
// data: remove from data (backup data for filter)

export const generalDelete = (history, url, id, index, filterData, data) => {
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
        .delete( `${Api}${url}/${id}`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success){
                messageAlert.success({ content: message, key: id})
                setToken(res.headers && res.headers.authorization)
                if (index >= 0) { // if Entity is delete from ListView
                    // filterData.splice(index,1) // deleting Index
                    let delFdata = filterData.filter((el,index) => el.id !== id)
                    let delData = []
                    if (data){ //searching data  to show in filterData
                        delData = data.filter((el,index) => el.id !== id) // deleting Index
                    }
                    return {success: success, data: delData, filterData: delFdata} //Set the data...
                }else{ // if Entitiy is delete from view... 
                    history.goBack()
                    return {success} //Set the data...
                }
            }
            return {success};
        })
        .catch((err) => {
            return apiErrorRes(err, id, 5)
        });
};