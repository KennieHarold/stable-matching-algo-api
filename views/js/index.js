/* eslint-disable no-undef */
var baseurl = window.location.protocol + '//' + window.location.host + '/';

var currentUserId = '';
var currentUser = '';
var currentUserPreferenceId = '';
var currentUserPreferences = null;
var currentUserGender = null;
var users = [];

$(window).on('load', function () {
  getUsers();

  $('#login-btn').on('click', login);
  $('#make-preferences-btn').on('click', makePreferences);
});

async function getUsers() {
  const res = await axios.get(baseurl + 'api/users');
  const length = res?.data?.users?.length || 0;
  $('#users-legth').text(length);

  users = res?.data?.users || [];
  const usersTable = $('#users-table');
  $('#users-table').empty();

  users.forEach((user) => {
    if (user.name === currentUser) {
      currentUserId = user.id;
      currentUserPreferences = user.preferences;
      currentUserGender = user.gender;
      currentUserPreferenceId = user.preferenceId;
      $('#user-gender').text(user.gender);
    }

    usersTable.append(`
      <tr>
        <td>${user.preferenceId}</td>
        <td>${user.name}</td>
        <td>${user.gender}</td>
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
    if (users.length >= 10) {
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
        $('#preferences-drag-list').show();
      } else {
        $('#match-container').show();
      }
    } else {
      $('#insufficient-users-alert').show();
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

async function makePreferences() {
  try {
    const irvingsChildren = $('#irvings-preferences-list')[0].children;
    const galeChildren = $('#gale-preferences-list')[0].children;

    const irvingsParams = [];
    const galeParams = [];

    for (let i = 0; i < irvingsChildren.length; i++) {
      irvingsParams.push(irvingsChildren[i].dataset.preferenceId);
    }

    for (let i = 0; i < galeChildren.length; i++) {
      galeParams.push(galeChildren[i].dataset.preferenceId);
    }

    const data = {
      preferences: {
        irvings: irvingsParams,
        gale: galeParams,
      },
    };

    const res = await axios
      .patch(baseurl + 'api/user/preference/' + currentUserId, data)
      .catch((error) => alert(error.response.data.error));

    if (res.status == 200) {
      $('#preferences-drag-list').hide();
      $('#match-container').show();

      getUsers();
      alert(res.data.message);
    }
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function geAllPreferences(method) {
  try {
    const res = await axios
      .post(baseurl + 'api/users/preference', {method})
      .catch((error) => alert(error.response.data.error));

    if (res.status === 200) {
      $('#user-algorithm').text(method);

      if (res.data.matches) {
        const matches = res.data.matches;

        if (method === 'irvings') {
          // Sample output: [[],[],[]]

          const matchPreferenceId =
            matches[parseInt(currentUserPreferenceId)][0];

          const chosenUser = users.find(
            (user) => user.preferenceId === matchPreferenceId.toString(),
          );

          $('#user-match').text(chosenUser.name);
        } else {
          const matchPreferenceId = matches[parseInt(currentUserPreferenceId)];

          const chosenUser = users.find(
            (user) => user.preferenceId === matchPreferenceId.toString(),
          );

          $('#user-match').text(chosenUser.name);
        }
      } else {
        $('#user-match').text('No match!');
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function clearUsersDB() {
  const res = await axios
    .delete(baseurl + 'api/users')
    .catch((error) => alert(error.response.data.error));

  if (res.status === 200) {
    window.location.reload();
    alert("Successfully cleared users' database!");
  }
}
