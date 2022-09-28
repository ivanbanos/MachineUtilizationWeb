import configData from '../config.json'

const AddUsers = async (userName, password, role, idClient) => {
  try {
    const token = localStorage.getItem('token')
    const body = {
      guid: '00000000-0000-0000-0000-000000000000',
      username: userName,
      password: password,
    }
    if (role == undefined) {
      body.idRole = 1
    } else {
      body.idRole = role
    }

    console.log(idClient == null)
    console.log(idClient == undefined)

    if (idClient != 'undefined') {
      body.idClient = idClient
    }
    console.log(body)
    const response = await fetch(configData.SERVER_URL + '/api/Users/createUser', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(body),
      headers: {
        'Access-Control-Allow-Origin': '*',
        accept: 'text/plain',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        'sec-fetch-mode': 'cors',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': 'https://machineutilization.dbhaffnerna3.com',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
    })
    if (response.status == 200) {
      let user = await response.json()
      return user
    }
    if (response.status == 403) {
      return 'fail'
    }
    return 'fail'
  } catch (error) {
    return 'fail'
  }
}

export default AddUsers
