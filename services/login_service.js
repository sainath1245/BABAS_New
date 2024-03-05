import { BASE_URL } from "../src/utils/consts";

function service() {
  const getLoginData = async (email, password) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    };
    let response = await fetch(
      BASE_URL + 'Login/UserLogin/',
      requestOptions
    );
    let json = await response.json();
    console.log('data --------- ' + JSON.stringify(json))
    return json;
  };

  return {
    getLoginData
  };
}

const login_service = service();

export default login_service;
