select apex_view_name
  from apex_dictionary
 where column_id = 0
--   and apex_view_name like upper('%' || :search_string || '%')
;
