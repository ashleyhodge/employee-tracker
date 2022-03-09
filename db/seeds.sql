INSERT INTO departments (department_name)
VALUES
    ('Administration/Operations'),
    ('Research and Development'),
    ('Marketing and Sales'),
    ('Human resources'),
    ('Customer services'),
    ('Accounting and Finance');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Assistant', '34839.00', 1),
    ('Coordinator', '59818.00', 1),
    ('Administrator', '62009.00', 1),
    ('Data scientist', '109505.00', 2),
    ('R&D Coordinator', '80904.00', 2),
    ('Data analyst', '65617.00', 2),
    ('Marketing analyst', '60294.00', 3),
    ('Marketing consultant', '56407.00', 3),
    ('Promotions manager', '49345.00', 3),
    ('Marketing specialist', '57817.00', 3),
    ('Chief diversity officer', '108085.00', 4),
    ('Recruiter', '52331.00', 4),
    ('HR information specialist', '55130.00', 4),
    ('HR Director', '91092.00', 4),
    ('Customer service rep', '50209.00', 5),
    ('Customer service manager', '45250.00', 5),
    ('Chief customer officer', '79749.00', 5),
    ('Staff accountant', '56598.00', 6),
    ('Accounting manager', '80033.00', 6),
    ('Project accountant', '62160.00', 6),
    ('Chief Finacial Officer', '132910.00', 6),
    ('Finacial analyst', '68445.00', 6),
    ('Chief Executive Officer', '195000.00', 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Amanda', 'Howell', 1, 3),
    ('Kenneth', 'Donovan', 2, 3),
    ('Samantha', 'Smith', 3, 23),
    ('Seth', 'Kim', 4, 5),
    ('Gordan', 'Ryan', 5, 23),
    ('Sabrina', 'Taylor', 6, 5),
    ('Margret', 'Murphy', 7, 9),
    ('Jessica', 'Miller', 8, 9),
    ('Kimberly', 'Wheeler', 9, 23),
    ('Rebekah', 'Gonzalez', 10, 9),
    ('Michael', 'Reynolds', 11, 23),
    ('Alexander', 'Johnson', 12, 14),
    ('Jocelyn', 'Gregory', 13, 14),
    ('Connor', 'Mullen', 14, 23),
    ('Sarah', 'Hayes', 15, 17),
    ('Joshua', 'Pham', 16, 17),
    ('Gregery', 'Moore', 17, 23),
    ('James', 'Nolan', 18, 21),
    ('Kevin', 'Cameron', 19, 21),
    ('Rick', 'Santos', 20, 21),
    ('Brian', 'Reyes', 21, 23),
    ('Robin', 'Mercer', 22, 21),
    ('Michael', 'Rice', 23, NULL);

