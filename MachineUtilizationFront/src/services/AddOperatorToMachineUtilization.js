import configData from '../config.json'

const AddOperatorToMachineUtilization = async (operator, machineUtilization, hours) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(
      configData.SERVER_URL +
        '/api/Operators/Add/Operator/' +
        operator +
        '/MacihneUtilization/' +
        machineUtilization +
        '/Hours/' +
        hours,
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          accept: 'text/plain',
          Authorization: 'Bearer ' + token,
          'sec-fetch-mode': 'cors',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': 'https://machineutilization.dbhaffnerna3.com',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
      },
    )
    if (response.status == 200) {
      let machines = await response.json()
      return machines
    }
    if (response.status == 403) {
      return 'fail'
    }
    return 'fail'
  } catch (error) {
    return 'fail'
  }
}

export default AddOperatorToMachineUtilization
