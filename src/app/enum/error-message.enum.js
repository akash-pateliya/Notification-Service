const eErrorMessage = {
    DbErrorMessage : 'Could not connect to the database. Exiting now...',
    EmptyContent : 'Request Body can not be empty',
    EmailOrPrimaryNumberIsRequired : 'Email Id or Mobile Number is mandatory !',
    UsersAndMediumCanNotBeEmpty : 'Users and Mediums cannot be empty !'
}
Object.freeze(eErrorMessage);
module.exports = eErrorMessage;