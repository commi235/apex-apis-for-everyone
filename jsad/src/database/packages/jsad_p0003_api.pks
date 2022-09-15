create or replace package jsad_p0003_api
  authid definer
as

  procedure delete_employee_callback
  (
    pi_empno in emp_apxw.empno%type
  );

  procedure reset_data;

end jsad_p0003_api;
/
