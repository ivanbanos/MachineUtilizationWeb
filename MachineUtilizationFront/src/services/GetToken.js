import configData from '../config.json'

const GetToken = async (username, password) => {
  try {
    const response = await fetch(
      configData.SERVER_URL + '/api/Users/' + username + '/' + password,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          accept: 'text/plain',
          'sec-fetch-mode': 'cors',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': 'https://machineutilization.dbhaffnerna3.com',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
      },
    )
    if (response.status == 200) {
      let json = await response.json()
      return json
    }
    return null
  } catch (error) {}
}

export default GetToken
