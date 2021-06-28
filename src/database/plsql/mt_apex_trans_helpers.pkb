create or replace package body mt_apex_trans_helpers
as

  procedure set_workspace_id
  (
    pi_application_id in number
  )
  as
    l_workspace_id number;
  begin
    -- Retrieve Workspace ID where main application is installed
    select workspace_id
      into l_workspace_id
      from apex_applications
    where application_id = pi_application_id
    ;
    -- Set environment using derived Workspace ID
    apex_util.set_security_group_id( l_workspace_id );
  end set_workspace_id;

  function get_languages
  (
    pi_application_id in number
  , pi_languages      in number
  )
    return apex_t_varchar2
  as
    l_language_tab apex_t_varchar2;
  begin
    if pi_languages is not null then
      l_language_tab :=
        apex_string.split
        (
          p_str => pi_languages
        , p_sep => ':'
        )
      ;
    else
      select translated_app_language
        bulk collect into l_language_tab
        from apex_application_trans_map
       where primary_application_id = pi_application_id
      ;  
    end if;
    return l_language_tab;
  end get_languages;

  procedure seed_translations
  (
    pi_application_id in number
  , pi_languages      in varchar2 default null
  )
  as
    l_language_tab apex_t_varchar2;
  begin
    set_workspace_id( pi_application_id => pi_application_id );
    l_language_tab := 
      get_languages
      ( 
        pi_application_id => pi_application_id
      , pi_languages      => pi_languages
      )
    ;
    for i in 1..l_language_tab.count
    loop
      apex_lang.seed_translations
      (
        p_application_id => pi_application_id
      , p_language       => l_language_tab(i)
      );
    end loop;
  end seed_translations;

  procedure publish_applications
  (
    pi_application_id in number
  , pi_languages      in varchar2 default null
  )
  as
    l_language_tab apex_t_varchar2;
  begin
    set_workspace_id( pi_application_id => pi_application_id );    
    l_language_tab := 
      get_languages
      ( 
        pi_application_id => pi_application_id
      , pi_languages      => pi_languages
      )
    ;
    for i in 1..l_language_tab.count
    loop
      apex_lang.publish_application
      (
        p_application_id => pi_application_id
      , p_language       => l_language_tab(i)
      );
    end loop;
  end publish_applications;

end mt_apex_helpers;
/
