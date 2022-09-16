DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE all_departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(50) NOT NULL
);

CREATE TABLE all_roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  job_title VARCHAR(30) NOT NULL,
  department_id INT NOT NULL,
  salary DECIMAL NOT NULL,
  INDEX departmentIndex(department_id),
  CONSTRAINT departmentKey FOREIGN KEY (department_id)
  REFERENCES all_departments(id)
);

CREATE TABLE all_employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  INDEX managerIndex(manager_id),
  CONSTRAINT managerKey FOREIGN KEY (manager_id)
  REFERENCES all_employees(id),
  INDEX roleIndex(role_id),
  CONSTRAINT employeeKey FOREIGN KEY (role_id)
  REFERENCES all_roles(id)
);





