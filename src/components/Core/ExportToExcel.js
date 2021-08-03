import React from "react";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const multiDataSet = [
    {
        columns: [
            { title: "Project Name:"},//pixels width 
            { title: "Service Internet"},//pixels width 
        ],
        data: [
            [
                {value: "Employee Name:"},//pixels width 
                {value: "Sameer Ahmed Qidwai"}
            ],
            [
                {value: "Employee Code:"},//pixels width 
                {value: "0000092"}
            ],
            [
                {value: "Organization:"},//pixels width 
                {value: "Sudoware"}
            ],
            [{xSteps: 1},],
            [
                {value: "Date", style: {font: {bold: true}}},
                {value: "Start Time ", style: {font: {bold: true}}},
                {value: "end Time", style: {font: {bold: true}}},
                {value: "Break", style: {font: {bold: true}}},
            ],
            [
                {value: "mar 1"},
                {value: "1 "},
                {value: "5"},
                {value: "2"},
            ],
            [
                {value: "mar 1"},
                {value: "1 "},
                {value: "5"},
                {value: "2"},
            ],
            [
                {value: "mar 1"},
                {value: "1 "},
                {value: "5"},
                {value: "2"},
            ],
            [
                {value: "mar 1"},
                {value: "1 "},
                {value: "5"},
                {value: "2"},
            ],
            [
                {value: "mar 1"},
                {value: "1 "},
                {value: "5"},
                {value: "2"},
            ],
        ]
    }
];


class ExportToExcel extends React.Component {

    componentDidMount = ()=> {
        document.getElementById("download").click()
        this.props.close()
    }
    
    render() {
        const { data } = this.props
        return (
            <ExcelFile element={<button hidden={true} id="download">Download Data</button>}>
                <ExcelSheet dataSet={data} name="Organization"/>
            </ExcelFile>
        );
    }
}

export default ExportToExcel