/* eslint-disable no-undef */
var baseurl = window.location.protocol + '//' + window.location.host + '/';

$(window).on('load', function () {
  getUsers();

  $('#login-btn').on('click', login);

  console.log('Loaded!');
});

async function getUsers() {
  const res = await axios.get(baseurl + 'api/users');
  const length = res?.data?.users?.length || 0;
  $('#users-legth').text(length);

  const users = res?.data?.users || [];
  const usersTable = $('#users-table');
  $('#users-table').empty();

  users.forEach((user) => {
    usersTable.append(`
      <tr>
        <td>${user.preferenceId}</td>
        <td>${user.name}</td>
        <td>${
          user.preferences.irvings.length > 0 &&
          user.preferences.gale.length > 0
            ? 'true'
            : 'false'
        }</td>
      </tr>
    `);
  });
}

async function login() {
  const name = $('#name-input').val();
  const selectedGender = [];
  $('input[name="flexRadioDefault"]:checked').each(function () {
    selectedGender.push(this.value);
  });

  const data = {
    name,
    gender: selectedGender[0],
  };

  const res = await axios.post(baseurl + 'api/user', data);

  if (res.status == 200) {
    $('#login-container').hide();
    $('#name-input').val('');

    const isMaleChecked = $('#check-male').prop('checked');

    if (!isMaleChecked) {
      $('#check-male').prop('checked', true);
    }

    $('#login-user').text(name);
    $('#welcome-container').show();
    getUsers();
    alert(res.data.message);
  } else {
    console.log(res);
    alert('Something went wrong!');
  }
}
