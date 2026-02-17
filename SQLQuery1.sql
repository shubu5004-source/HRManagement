CREATE DATABASE AuthDb;
GO
USE AuthDb;
CREATE TABLE Departments (
    Id INT IDENTITY PRIMARY KEY,
    DepartmentName NVARCHAR(100) NOT NULL
);
CREATE TABLE Users (
    Id INT IDENTITY PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Address NVARCHAR(200),
    PhoneNumber NVARCHAR(15),
    DepartmentId INT NOT NULL,
    Role NVARCHAR(20) NOT NULL,

    CONSTRAINT FK_Users_Departments
    FOREIGN KEY (DepartmentId) REFERENCES Departments(Id)
);
INSERT INTO Departments (DepartmentName)
VALUES ('HR'), ('IT'), ('Finance'), ('Sales');
