import React, { useEffect, useState } from "react";
import fileData from './assets/data.csv';
import './App.css';

function App() {
  const [ array, setArray ] = useState([]);
  const [pinCodeSearch, setPinCodeSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');

  const loadCSV = function(){
    fetch( fileData )
      .then( response => response.text() )
      .then( responseText => {
        csvFileToArray( responseText );
      })
  };

  useEffect(() => {
    loadCSV();
  
    return () => {}
  });
  
  // Reference : https://dev.to/pankod/how-to-import-csv-file-with-react-4pj2
  const csvFileToArray = string => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map(i => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index].replace(/:/g," - ").split(";");
        return object;
      }, {});
      return obj;
    });

    setArray(array);
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));

  function makeDateSameFormate(date) {
    let data = date.split('-');
    return `${data[2]}/${data[1]}/${data[0]}`
  };

  function searchByPinCode(row) {
    if (pinCodeSearch === "") {
      return row;
    }
    if (row?.deliveryPincode[0].includes(pinCodeSearch)) {
      return row;
    }
    return null;
  }

  const filteredArray = array.filter((row) => {
    if (dateSearch === "") {
      return searchByPinCode(row);
    } else if (makeDateSameFormate(dateSearch) === row.orderDate[0]) {
      return searchByPinCode(row);
    }

    return null;    
  });

  return (
    <div style={{ textAlign: "center" }}>
      <h1>AntStack FED Task</h1>

      <br />

      <div style={{ display:'flex', justifyContent: 'space-around' }}>
        <div>
          Search by PinCode : &nbsp;
          <input
            type='number'
            value={pinCodeSearch}
            onChange={(e) => setPinCodeSearch(e.target.value)}
          />
        </div>

        <div>
          Search by Date : &nbsp;
          <input
            type='date'
            value={dateSearch}
            onChange={(e) => setDateSearch(e.target.value)}
          />
        </div>
      </div>
      
      <br />

      <table>
        <thead>
          <tr key={"header"}>
            {headerKeys.map((key,index) => (
              <th key={index}>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredArray.length > 0 && filteredArray.map((item,index) => (
            <tr key={index}>
              {Object.values(item).map((value,i) => (
                <td key={i}>
                  {value.map((val,j) => (
                    <p key={j}>{val}</p>
                  ))}
                </td>
              ))}
            </tr>
          ))}
          {filteredArray.length < 1 && 
          <tr> 
            <td colSpan={5} style={{ textAlign:'center' }}>
              no order available
            </td>
          </tr>
          }
        </tbody>
      </table>

    </div>
  );
}

export default App;
