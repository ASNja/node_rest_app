// Userlist data array for filling in info box
var userListData = [];




// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Add User button click
    $('#btnAddLeave').on('click', addLeave);

    // Update User link click
    // $('#userList table tbody').on('click', 'td a.linkupdateuser', updateUser);
    // FAIS PLANTER LA FONCTION DELETE, OFC


    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function(data) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function() {
            tableContent += '<tr>';
            tableContent += '<td><a href="/' + this._id + '">' + this._id + '</a></td>';
            // tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Plus d\'informations">' + this.username + '</a></td>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Plus d\'informations">' + this.username + '</a></td>';
            tableContent += '<td>' + this.gender + '</td>';
            tableContent += '<td>' + this.age + '</td>';
            tableContent += '<td>' + this.location + '</td>';
            tableContent += '<td>' + this.branch + '</td>';
            tableContent += '<td>' + this.job + '</td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td>' + this.phone + '</td>';
            tableContent += '<td>' + this.leave_start + '</td>';
            tableContent += '<td>' + this.leave_end + '</td>';
            tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this._id + '">Editer</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">Supprimer</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.username);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoLocation').text(thisUserObject.location);
    $('#userInfoBranch').text(thisUserObject.branch);
    $('#userInfoJob').text(thisUserObject.job);
    $('#userInfoEmail').text(thisUserObject.email);
    $('#userInfoPhone').text(thisUserObject.phone);
    $('#userInfoLeaveStart').text(thisUserObject.leave_start);
    $('#userInfoLeaveEnd').text(thisUserObject.leave_end);

};








////////////////////////////// GET ? //////////////////////////////

// 
function getUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Voulez-vous vraiment supprimer cet employé ?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'GET',
            url: '/users/userlist/' + this._id
        }).done(function(response) {

            // Check for a successful (blank) response
            if (response.msg === '') {} else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    } else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

/////////////////////////////////////////////////////////////










// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if ($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'branch': $('#addUser fieldset input#inputUserBranch').val(),
            'job': $('#addUser fieldset input#inputUserJob').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'phone': $('#addUser fieldset input#inputUserPhone').val(),


            // 'username': $('#addUser fieldset input#inputUserName').val(),
            // 'email': $('#addUser fieldset input#inputUserEmail').val(),
            // 'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            // 'age': $('#addUser fieldset input#inputUserAge').val(),
            // 'location': $('#addUser fieldset input#inputUserLocation').val(),
            // 'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(response) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            } else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    } else {
        // If errorCount is more than 0, error out
        alert('Veuillez remplir tous les champs.');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Voulez-vous vraiment supprimer cet employé ?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function(response) {

            // Check for a successful (blank) response
            if (response.msg === '') {} else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    } else {

        // If they said no to the confirm, do nothing
        return false;

    }

};













// LEAVE ========================================================================== 

function addLeave(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addLeave input').each(function(index, val) {
        if ($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            // Clusterfuck
            // 'id': this._id,
            // 'username': this.username,
            // 'gender': this.gender,
            // 'age': this.age,
            // 'location': this.location,
            // 'branch': this.branch,
            // 'job': this.job,
            // 'email': this.email,
            // 'phone': this.phone,
            // Clusterfuck end

            'leave_start': $('#addLeave fieldset input#inputUserLeaveStart').val(),
            'leave_end': $('#addLeave fieldset input#inputUserLeaveEnd').val(),

            // 'username': $('#addUser fieldset input#inputUserName').val(),
            // 'email': $('#addUser fieldset input#inputUserEmail').val(),
            // 'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            // 'age': $('#addUser fieldset input#inputUserAge').val(),
            // 'location': $('#addUser fieldset input#inputUserLocation').val(),
            // 'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST', // POST CHANGE EN PUT
            data: newUser,
            // url: '/users/adduser',
            // Ligne du dessous ajoutée
            url: '/users/adduser/:id',
            dataType: 'JSON'
        }).done(function(response) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addLeave fieldset input').val('');

                // Update the table
                populateTable();

            } else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    } else {
        // If errorCount is more than 0, error out
        alert('Veuillez remplir tous les champs.');
        return false;
    }
};