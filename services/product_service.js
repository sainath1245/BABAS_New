function service() {
  const getAllProducts = async () => {
    console.log('sddsfdsf sdfsdf')
    let response = await fetch(
      'https://datausa.io/api/data?drilldowns=Nation&measures=Population'
    );
    let json = await response.json();
    console.log('data response :: :: :: ::  ::: ::  '+json.data)
    return json.data;
  };

  return {
    getAllProducts
  };
}

const product_service = service();

export default product_service;
