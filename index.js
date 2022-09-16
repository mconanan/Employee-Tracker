const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
const Employee = require("./employee");
const Role = require("./role");

// CREATE A CONNECTION TO THE DATABASE
const db = mysql.createConnection({
  host: "localhost",
  user: "mconanan",
  password: "root",
  database: "employee_db",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// FIRST QUESTION
const start = [
  {
    type: "list",
    message: "What would you like to do first?",
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add an employee",
      "update an employee role",
    ],
    name: "action",
  },
];

// CREATE AN EMPLOYEE QUESTIONS
const employeeQuestions = [
  {
    type: "input",
    message: "What is the employee's first name?",
    name: "first_name",
    default: "First Name",
  },
  {
    type: "input",
    message: "What is the employee's last name?",
    name: "last_name",
    default: "Last Name",
  },
  {
    type: "list",
    message: "What is the employee's role?",
    name: "employee_role",
    default: "Employee Role",
  },
  {
    type: "input",
    message: "Who is the employee's manager?",
    name: "manager",
    default: "Manager",
  },
];

const addDeptRow = {
  type: "input",
  message: "What is the name of the department you would like to add?",
  name: "new_department",
  default: "New Department",
};


//FUNCTION TO INITIATE INQUIRER
function init() {
  return inquirer.prompt(start).then((answer) => {
    console.log("start action", answer);

    switch (answer.action) {
      case "view all departments":
        db.query("SELECT * FROM all_departments", function (err, results) {
          console.table(results);
          console.log(results);
          init();
        });

        break;

      case "view all roles":
        db.query("SELECT * FROM all_roles", function (err, results) {
          console.table(results);
          init();
        });

        break;

      case "view all employees":
        db.query("SELECT * FROM all_employees", function (err, results) {
          console.table(results);
          init();
        });
        break;

      case "add a department":
        addDepartment();
        break;

      case "add a role":
        addRole();
        break;

      case "add an employee":
        addEmployee();
        break;

      case "update an employee role":
        updateEmployeeRole();
        break;
      default:
    }
  });
}

// ADD DEPARTMENT FUNCTION
const addDepartment = () => {
  return inquirer.prompt(addDeptRow).then((answer) => {
    const deptSql =
      "INSERT INTO all_departments (department_name) VALUES('" +
      answer.new_department +
      "')";
    console.log("dept", deptSql);
    db.query(deptSql, function (err, results) {
      if (err) {
        console.log(err);
      }
      console.table(results);

      init();
    });
  });
};

// CREATING ARRAY OF DEPARTMENTS FOR INQUIRER QUESTION
var departmentChoices;
db.query("SELECT * FROM all_departments", function (err, results) {
  if (err) {
    console.error(err);
  }
  console.table(results);

  departmentChoices = results.map((department) => {
    console.log('department', department);
    return {name: department.department_name, value: department.id};
  });

  console.log(departmentChoices);
});

// ADD ROLE FUNCTION
const addRole = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the role you would like to add?",
        name: "new_role",
        default: "New Role",
      },
      {
        type: "list",
        message: "Which department is the new role under?",
        choices: departmentChoices,
        name: "role_department",
        default: "New Role Department",
      },
      {
        type: "input",
        message: "What is the salary of the role you would like to add?",
        name: "role_salary",
        default: "New Role Salary",
      },
    ])
    .then((answers) => {
      const role = [`'${answers.new_role}'`, answers.role_department, parseFloat(answers.role_salary),].join(",");

      console.log("role", role);

      const roleSql =
        "INSERT INTO all_roles (job_title, department_id, salary) VALUES(" +
        role +
        ")";

      db.query(roleSql, function (err, results) {
        if (err) {
          console.log(err);
        }

        console.table(results);

        init();
      });
    });
};

//ADD EMPLOYEE FUNCTION
const addEmployee = () => {
  return inquirer.prompt(employeeQuestions).then((answers) => {
    const employee = new Employee(
      answers.first_name,
      answers.last_name,
      answers.job_title,
      answers.deparment,
      answers.salary,
      answers.manager_id
    );

    const employeeSql =
      "INSERT INTO all_employees (first_name, last_name, job_title, deparment, salary, manager_id) VALUES('" +
      employee.getInfo() +
      "')";

    db.query(employeeSql, function (err, results) {
      if (err) {
        console.log(err);
      }

      console.table(results);

      init();
    });
  });
};

// CALLS INQUIRER START FUNCTION
init();

// TO DO:
// - HOW TO ASK, "WHICH DEPARTMENT IS THE NEW ROLE UNDER?"
