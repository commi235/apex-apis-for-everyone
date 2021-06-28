create or replace package mt_apex_trans_helpers
  authid definer
as

  procedure seed_translations
  (
    pi_application_id in number
  , pi_languages      in varchar2 default null
  );

  procedure publish_applications
  (
    pi_application_id in number
  , pi_languages      in varchar2 default null
  );

end mt_apex_helpers;
/
