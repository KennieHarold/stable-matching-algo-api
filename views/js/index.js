/* eslint-disable no-undef */
var baseurl = window.location.protocol + '//' + window.location.host + '/';
var currentUser = '';
var currentUserPreferences = null;
var currentUserGender = null;

$(window).on('load', function () {
  getUsers();

  $('#login-btn').on('click', login);
});

async function getUsers() {
  const res = await axios.get(baseurl + 'api/users');
  const length = res?.data?.users?.length || 0;
  $('#users-legth').text(length);

  const users = res?.data?.users || [];
  const usersTable = $('#users-table');
  $('#users-table').empty();

  users.forEach((user) => {
    if (user.name === currentUser) {
      currentUserPreferences = user.preferences;
      currentUserGender = user.gender;
      $('#user-gender').text(user.gender);
    }

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

  // Set preferences
  $('#irvings-preferences-list').empty();
  $('#gale-preferences-list').empty();

  if (currentUserPreferences && currentUserGender) {
    if (
      currentUserPreferences.irvings.length <= 0 &&
      currentUserPreferences.gale.length <= 0
    ) {
      users.forEach((user) => {
        if (user.name !== currentUser) {
          $('#irvings-preferences-list').append(`
          <div class="draggable" data-preference-id="${user.preferenceId}">${user.name}</div>
        `);
        }
      });

      users.forEach((user) => {
        if (user.name !== currentUser && user.gender !== currentUserGender) {
          $('#gale-preferences-list').append(`
          <div class="draggable" data-preference-id="${user.preferenceId}">${user.name}</div>
        `);
        }
      });

      makeDraggable();
    } else {
      $('#preferences-drag-list').hide();
    }
  }
}

async function login() {
  const name = $('#name-input').val();

  if (name === '') {
    alert('Please enter name!');
    return;
  }

  const selectedGender = [];
  $('input[name="flexRadioDefault"]:checked').each(function () {
    selectedGender.push(this.value);
  });

  const data = {
    name,
    gender: selectedGender[0],
  };

  const res = await axios
    .post(baseurl + 'api/user', data)
    .catch((error) => alert(error.response.data.error));

  if (res.status == 200) {
    $('#login-container').hide();
    $('#name-input').val('');

    const isMaleChecked = $('#check-male').prop('checked');

    if (!isMaleChecked) {
      $('#check-male').prop('checked', true);
    }

    currentUser = name;

    $('#login-user').text(name);
    $('#welcome-container').show();

    getUsers();
    alert(res.data.message);
  }
}
