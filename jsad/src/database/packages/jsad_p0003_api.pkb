create or replace package body jsad_p0003_api
as

  procedure delete_employee_callback
  (
    pi_empno in emp_apxw.empno%type
  )
  as
    l_ename    emp_apxw.ename%type;
    l_job      emp_apxw.job%type;
    l_hiredate emp_apxw.hiredate%type;
    l_message  varchar2(32767);
  begin
    delete
      from emp_apxw
     where empno = apex_application.g_x01
    returning ename, job, hiredate into l_ename, l_job, l_hiredate
    ;

    l_message :=
      apex_lang.message
      (
        p_name => 'EMP_REMOVED_SUCCESS'
      , p0 => l_ename
      , p1 => l_job
      , p2 => apex_util.get_since( p_date => l_hiredate, p_short => 'Y' )
      )
    ;

    apex_json.open_object;
    apex_json.write( p_name => 'success', p_value => true );
    apex_json.open_object( p_name => 'data' );
    apex_json.write( p_name => 'successMessage', p_value => l_message );
    apex_json.close_all;

  exception
    when others then
      apex_json.open_object;
      apex_json.write( p_name => 'success', p_value => false );
      apex_json.open_object( p_name => 'data' );
      apex_json.write( p_name => 'errorMessage', p_value => 'Error during operation' );
      apex_json.close_all;
  end delete_employee_callback;

  procedure reset_data
  as
  begin
    delete from emp_apxw;
    insert into emp_apxw
      select *
        from emp
    ;
  end reset_data;

end jsad_p0003_api;
/
