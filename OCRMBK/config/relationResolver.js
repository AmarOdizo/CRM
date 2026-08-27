const mongoose = require("mongoose");
const Client = require("../models/Client");
const User = require("../models/User");
const Role = require("../models/Role");
const Employee = require("../models/Employee");

/**
 * Resolves a client name/company name to a Client ObjectId.
 */
const resolveClientRef = async (clientName) => {
  if (!clientName) return null;
  
  // If it's already a valid ObjectId string, return it as ObjectId
  if (mongoose.Types.ObjectId.isValid(clientName)) {
    return new mongoose.Types.ObjectId(clientName);
  }

  try {
    const client = await Client.findOne({
      $or: [
        { clientName: { $regex: new RegExp(`^${clientName.trim()}$`, "i") } },
        { companyName: { $regex: new RegExp(`^${clientName.trim()}$`, "i") } }
      ]
    });
    return client ? client._id : null;
  } catch (err) {
    console.error(`Error resolving Client ref for "${clientName}":`, err.message);
    return null;
  }
};

/**
 * Resolves a username/fullName to a User ObjectId.
 */
const resolveUserRef = async (userName) => {
  if (!userName) return null;

  if (mongoose.Types.ObjectId.isValid(userName)) {
    return new mongoose.Types.ObjectId(userName);
  }

  try {
    // 1. Try to find by fullName in User
    let user = await User.findOne({
      fullName: { $regex: new RegExp(`^${userName.trim()}$`, "i") }
    });

    if (!user) {
      // 2. Try to find by name in Employee
      const employee = await Employee.findOne({
        name: { $regex: new RegExp(`^${userName.trim()}$`, "i") }
      });
      if (employee) {
        // Find User corresponding to the employee's ID
        user = await User.findOne({ employeeId: employee.employeeid });
      }
    }
    return user ? user._id : null;
  } catch (err) {
    console.error(`Error resolving User ref for "${userName}":`, err.message);
    return null;
  }
};

/**
 * Resolves a role name/code to a Role ObjectId.
 */
const resolveRoleRef = async (roleName) => {
  if (!roleName) return null;

  if (mongoose.Types.ObjectId.isValid(roleName)) {
    return new mongoose.Types.ObjectId(roleName);
  }

  try {
    const role = await Role.findOne({
      $or: [
        { roleName: { $regex: new RegExp(`^${roleName.trim()}$`, "i") } },
        { roleCode: { $regex: new RegExp(`^${roleName.trim()}$`, "i") } }
      ]
    });
    return role ? role._id : null;
  } catch (err) {
    console.error(`Error resolving Role ref for "${roleName}":`, err.message);
    return null;
  }
};

module.exports = {
  resolveClientRef,
  resolveUserRef,
  resolveRoleRef
};
