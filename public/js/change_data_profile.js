const inputSurname = document.getElementById('input-surname');
const inputName = document.getElementById('input-name');
const inputAddress = document.getElementById('input-address');

inputSurname.addEventListener('change', async (e) => {
  const valueInput = e.target.value;
  try {
    const response = await fetch(`/updateSurnameProfile?value=${valueInput.toString()}`);
    const info = await response.json();
    e.target.value = info.surname;
    e.target.blur();
  } catch (error) {
    console.log(error);
  }
});

inputName.addEventListener('change', async (e) => {
  const valueInput = e.target.value;
  try {
    const response = await fetch(`/updateNameProfile?value=${valueInput.toString()}`);
    const info = await response.json();
    e.target.value = info.name;
    e.target.blur();
  } catch (error) {
    console.log(error);
  }
});

inputAddress.addEventListener('change', async (e) => {
  const valueInput = e.target.value;
  try {
    const response = await fetch(`/updateAddressProfile?value=${valueInput.toString()}`);
    const info = await response.json();
    e.target.value = info.address;
    e.target.blur();
  } catch (error) {
    console.log(error);
  }
});