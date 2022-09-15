var myItem = apex.item( this.triggeringElement );
apex.debug.info( "Got Page Item", myItem );

var myData = myItem.getValue();
apex.debug.info( "Got value", myData );

if ( myData.includes( apex.locale.getGroupSeparator() ) ) {
  apex.debug.info( "Found group separator in value", myData );

  // new and shiny
  apex.message.alert(
    apex.lang.formatMessage( "NUM_VAL_ERROR", apex.locale.getGroupSeparator() ),
    function () {
      myItem.setFocus();
    }
  );

  //old and clumsy...
  //alert(
  //  apex.lang.formatMessage( "NUM_VAL_ERROR", apex.locale.getGroupSeparator() )
  //);
}
