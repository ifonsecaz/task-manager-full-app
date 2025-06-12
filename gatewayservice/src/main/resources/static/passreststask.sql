create database passresetstask;

use passresetstask;

create table tokenvalid(
	user_id bigint primary key,
    last_password_reset Date
);

select *  from tokenvalid;