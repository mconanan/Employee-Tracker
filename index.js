const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");



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

// VARIABLE FOR QUESTION TO ADD A DEPARTMENT
const addDeptRow = {
  type: "input",
  message: "What is the name of the department you would like to add?",
  name: "new_department",
  default: "New Department",
};

//FUNCTION TO INITIATE INQUIRER
function init() {
  return inquirer.prompt(start).then((answer) => {
    // SWITCH CASE FOR ALL ANSWERS TO FIRST QUESTION
    switch (answer.action) {
      case "view all departments":
        db.query("SELECT * FROM all_departments", function (err, results) {
          console.table(results);

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
    
    db.query(deptSql, function (err, results) {
      if (err) {
        console.log(err);
      }
      console.table(results);

      init();
    });
  });
};

// CREATING ARRAY OF DEPARTMENTS FOR ADD ROLE INQUIRER PROMPTS
const getAllDepts = () => {
  return new Promise((resolve, reject) => {
    var departmentChoices;
    db.query("SELECT * FROM all_departments", function (err, results) {
      if (err) {
        console.error(err);
        return reject(err);
      }
      console.table(results);

      departmentChoices = results.map((department) => {
        return { name: department.department_name, value: department.id };
      });

      resolve(departmentChoices);
    });
  });
};

// ADD ROLE FUNCTION
const addRole = () => {
  getAllDepts().then((departmentChoices) => {
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
        const role = [
          `'${answers.new_role}'`,
          answers.role_department,
          parseFloat(answers.role_salary),
        ].join(",");


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
  });
};

// CREATING ARRAYS TO USE FOR ADD EMPLOYEES INQUIRER PROMPTS
const getAllManagers = () => {
  return new Promise((resolve, reject) => {
    var managerChoices;
    db.query(
      "SELECT first_name, id FROM all_employees",
      function (err, results) {
        if (err) {
          console.error(err);
          return reject(err);
        }
        console.table(results);

        managerChoices = results.map((manager) => {
          console.log("manager ID", manager);
          return { name: manager.first_name, value: manager.id };
        });

        resolve(managerChoices);
      }
    );
  });
};

const getAllRoles = () => {
  return new Promise((resolve, reject) => {
    var roleChoices;
    db.query("SELECT job_title, id FROM all_roles", function (err, results) {
      if (err) {
        console.error(err);
        return reject(err);
      }
      console.table(results);

      roleChoices = results.map((role) => {
        return { name: role.job_title, value: role.id };
      });

      resolve(roleChoices);
    });
  });
};

//ADD EMPLOYEE FUNCTION USING THE GETALLROLES & GETALLMANAGERS FUNCTIONS TO POPULATE ARRAYS FOR QUESTION CHOICES
const addEmployee = () => {
  var addEmployeeAnswers = {};
  getAllRoles().then((roleChoices) => {
    return inquirer
      .prompt([
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
          choices: roleChoices,
          name: "employee_role",
          default: "Employee Role",
        },
      ])
      .then((answers) => {
        

        addEmployeeAnswers.first_name = answers.first_name;
        addEmployeeAnswers.last_name = answers.last_name;
        addEmployeeAnswers.employee_role = answers.employee_role;

        getAllManagers()
          .then((managerChoices) => {
            return inquirer
              .prompt([
                {
                  type: "list",
                  message: "Who is the employee's manager?",
                  choices: managerChoices,
                  name: "manager",
                  default: "Manager",
                },
              ])
              .then((answers) => {
                return answers;
              });
          })
          .then((answers) => {
            const employee = [
              `'${addEmployeeAnswers.first_name}',
            '${addEmployeeAnswers.last_name}',
            '${addEmployeeAnswers.employee_role}',
            '${answers.manager}',`,
            ];

            console.log('addemployeeanswers', addEmployeeAnswers)

            const employeeSql = `INSERT INTO all_employees (first_name, last_name, role_id, manager_id) VALUES("${addEmployeeAnswers.first_name}","${addEmployeeAnswers.last_name}", "${addEmployeeAnswers.employee_role}", "${answers.manager}");`;

            db.query(employeeSql, function (err, results) {
              if (err) {
                console.log(err);
              }

              console.table(results);

              init();
            });
          });
      });
  });
};

// CALLS INQUIRER START FUNCTION
init();


