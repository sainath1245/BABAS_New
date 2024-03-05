import { BASE_URL } from "../src/utils/consts";

function service() {
  const getChangePasswordData = async (token, userId, password, confirmPassword) => {
    var bearer = 'Bearer ' + token;
    var number = parseInt(userId);
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': bearer, 'Content-Type': 'application/json' },
      body: JSON.stringify({ empID: number, currentPass: password, newPass: confirmPassword })
    };
    let response = await fetch(
      BASE_URL + 'User/ChangePassword',
      requestOptions
    );
    let json = await response.json();
    console.log('data --------- ' + JSON.stringify(json))
    return json;
  };

  return {
    getChangePasswordData
  };
}

const change_password_service = service();

export default change_password_service;
