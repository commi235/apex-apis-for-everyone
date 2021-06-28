declare
  l_ename    emp_apxw.ename%type;
  l_job      emp_apxw.job%type;
  l_hiredate emp_apxw.hiredate%type;
begin
  delete
    from emp_apxw
   where empno = apex_application.g_x01
  returning ename
          , job
          , hiredate
       into l_ename
          , l_job
          , l_hiredate
  ;

  apex_json.open_object;
  apex_json.write( 'ename', l_ename );
  apex_json.write( 'job', l_job );
  apex_json.write( 'amount', apex_util.get_since( p_date => l_hiredate, p_short => true ) );
  apex_json.close_all;
end;
