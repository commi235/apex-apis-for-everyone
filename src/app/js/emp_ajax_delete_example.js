// Try to as much as possible use this.triggeringElement
// This is inbuilt by APEX on dynamic actions
var myID = $( this.triggeringElement ).data( "id" );
var myName = $( this.triggeringElement ).data( "name" );

// First remove any currently shown message
apex.message.hidePageSuccess();

// Notify user and ask if he wants to proceed
apex.message.confirm(
  // Get predefined message (Hint: Works nice with translation)
  apex.lang.formatMessage( "CONFIRM_EMP_DELETE", myName ),
  function ( okPressed ) {
    if ( okPressed ) {
      // Trigger PL/SQL Callback and hadn in empno
      apex.server.process(
        "DELETE_EMP",
        {
          x01: myID,
        },
        {
          success: function ( pData ) {
            // This was: console.log(pData); before
            // Using apex.debug is much better as it follows current debug level
            apex.debug.info( "Received data", pData );
            // Next call was deprecated in 19.2
            // not sure what the replacement will be when it come to using classes here
            // apex.event.trigger(".u-refresh-after-delete", "apexrefresh");

            apex.region( "EMP_AJAX_DELETE" ).refresh();

            // Again using a Textmessage (translation based on template with payload)
            var myMessage = apex.lang.formatMessage(
              "EMP_REMOVED_SUCCESS",
              pData.ename,
              pData.job,
              pData.amount
            );
            // Show the message so user understands action has been performed
            apex.message.showPageSuccess( myMessage );
          },
        }
      );
    }
  }
);
