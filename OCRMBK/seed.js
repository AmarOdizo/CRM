const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Import Models
const Role = require("./models/Role");
const Admin = require("./models/Admin");
const Employee = require("./models/Employee");
const User = require("./models/User");
const Client = require("./models/Client");
const Leads = require("./models/Leads");
const Project = require("./models/Project");
const Task = require("./models/Task");
const Invoice = require("./models/Invoice");
const Payment = require("./models/Payment");
const Meeting = require("./models/Meeting");
const Quotation = require("./models/Quotation");

// Import Counters
const Counter = require("./models/Counter");
const UserCounter = require("./models/UserCounter");
const RoleCounter = require("./models/RoleCounter");
const ClientCounter = require("./models/ClientCounter");
const ProjectCounter = require("./models/ProjectCounter");
const InvoiceCounter = require("./models/InvoiceCounter");
const { QuotationCounter } = require("./models/QuotationCounter");
const TaskCounter = require("./models/TaskCounter");

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB Database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Database Connected Successfully.");

    // ==========================================
    // CLEANING EXISTING DATA
    // ==========================================
    console.log("Cleaning existing collections...");
    await Promise.all([
      Role.deleteMany({}),
      Admin.deleteMany({}),
      Employee.deleteMany({}),
      User.deleteMany({}),
      Client.deleteMany({}),
      Leads.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({}),
      Invoice.deleteMany({}),
      Payment.deleteMany({}),
      Meeting.deleteMany({}),
      Quotation.deleteMany({}),
      
      Counter.deleteMany({}),
      UserCounter.deleteMany({}),
      RoleCounter.deleteMany({}),
      ClientCounter.deleteMany({}),
      ProjectCounter.deleteMany({}),
      InvoiceCounter.deleteMany({}),
      QuotationCounter.deleteMany({}),
      TaskCounter.deleteMany({})
    ]);
    console.log("✅ Collections cleaned.");

    // ==========================================
    // 1. SEED COUNTERS
    // ==========================================
    console.log("Initializing counters...");
    await Promise.all([
      Counter.create({ _id: "leadId", seq: 1 }),
      UserCounter.create({ _id: "userId", seq: 1 }),
      RoleCounter.create({ _id: "roleId", seq: 1 }),
      ClientCounter.create({ _id: "clientId", seq: 1 }),
      ProjectCounter.create({ id: "projectId", seq: 1 }),
      InvoiceCounter.create({ _id: "invoice", sequence: 1 }),
      QuotationCounter.create({ year: new Date().getFullYear(), sequence: 1 }),
      TaskCounter.create({ name: "taskSequence", sequenceValue: 1 })
    ]);
    console.log("✅ Counters initialized.");

    // ==========================================
    // 2. SEED ROLE
    // ==========================================
    console.log("Seeding Role...");
    const role = await Role.create({
      id: 1,
      roleName: "Super Developer",
      roleCode: "DEV",
      department: "Engineering",
      description: "Full Stack Software Developer",
      permissions: ["read:tasks", "write:tasks", "manage:clients", "view:reports"],
      status: "Active"
    });
    console.log(`✅ Role seeded: ${role.roleName} (${role.roleCode})`);

    // ==========================================
    // 3. SEED ADMIN & EMPLOYEE
    // ==========================================
    console.log("Seeding Admin & Employee...");
    const admin = await Admin.create({
      name: "Amar Admin",
      adminid: "ADM001",
      email: "admin@odizocrm.com",
      phone: "9876543210",
      adminrole: "DEV",
      roleRef: role._id,
      department: "Engineering",
      password: "AdminPass123"
    });

    const employee = await Employee.create({
      name: "Kamal Kumar",
      employeeid: "EMP001",
      email: "kamal@odizocrm.com",
      phone: "8765432109",
      department: "Engineering",
      designation: "Software Engineer",
      password: "KamalPass123"
    });
    console.log(`✅ Admin seeded: ${admin.name}`);
    console.log(`✅ Employee seeded: ${employee.name}`);

    // ==========================================
    // 4. SEED USER
    // ==========================================
    console.log("Seeding User...");
    const user = await User.create({
      id: 1,
      fullName: "Kamal Kumar",
      employeeId: "EMP001",
      email: "kamal@odizocrm.com",
      phone: "8765432109",
      department: "Engineering",
      designation: "Software Engineer",
      role: "DEV",
      roleRef: role._id,
      status: "Active",
      joiningDate: "2026-08-01",
      address: "123 Dev Lane, Tech City",
      notes: "Test developer user"
    });
    console.log(`✅ User seeded: ${user.fullName}`);

    // ==========================================
    // 5. SEED CLIENT
    // ==========================================
    console.log("Seeding Client...");
    const client = await Client.create({
      id: "1",
      clientName: "John Doe",
      companyName: "Acme Corporation",
      email: "john.doe@acme.com",
      phone: "7654321098",
      alternatePhone: "7654321099",
      gstNumber: "22AAAAA0000A1Z5",
      website: "www.acme.com",
      address: "456 Corporate Blvd",
      city: "Tech City",
      state: "California",
      country: "USA",
      pincode: "94016",
      industry: "Technology",
      clientType: "Enterprise",
      status: "Active",
      assignedEmployee: "Kamal Kumar",
      assignedEmployeeRef: user._id,
      notes: "Key enterprise client"
    });
    console.log(`✅ Client seeded: ${client.clientName}`);

    // ==========================================
    // 6. SEED LEADS
    // ==========================================
    console.log("Seeding Lead...");
    const lead = await Leads.create({
      id: 1,
      client: client._id,
      companyName: "Acme Corporation",
      email: "john.doe@acme.com",
      phone: "7654321098",
      address: "456 Corporate Blvd",
      businessRequirement: "Need a custom CRM system built and deployed.",
      leadSource: "Website",
      estimatedBudget: "$10000",
      status: "Qualified",
      followUpDate: "2026-09-01",
      assignedEmployee: "Kamal Kumar",
      assignedEmployeeRef: user._id,
      notes: "High priority lead"
    });
    console.log(`✅ Lead seeded for: ${lead.companyName}`);

    // ==========================================
    // 7. SEED PROJECT
    // ==========================================
    console.log("Seeding Project...");
    const project = await Project.create({
      id: "1",
      projectName: "CRM Implementation",
      projectCode: "PRJ-CRM",
      clientName: "John Doe",
      client: client._id,
      projectManager: "Kamal Kumar",
      projectManagerRef: user._id,
      teamMembers: ["Kamal Kumar"],
      teamMembersRefs: [user._id],
      startDate: "2026-09-01",
      endDate: "2026-12-31",
      budget: "$8000",
      priority: "High",
      status: "Planning",
      technologyStack: ["React", "NodeJS", "MongoDB"],
      description: "Custom CRM deployment for Acme Corp."
    });
    console.log(`✅ Project seeded: ${project.projectName}`);

    // ==========================================
    // 8. SEED TASK
    // ==========================================
    console.log("Seeding Task...");
    const task = await Task.create({
      taskNumber: 1,
      title: "Setup MongoDB Connection",
      description: "Setup mongoose connection in the backend application and verify.",
      assignedTo: user._id,
      assignedBy: user._id,
      priority: "High",
      status: "Pending",
      startDate: new Date("2026-08-27"),
      dueDate: new Date("2026-08-30")
    });
    console.log(`✅ Task seeded: ${task.title}`);

    // ==========================================
    // 9. SEED INVOICE
    // ==========================================
    console.log("Seeding Invoice...");
    const invoice = await Invoice.create({
      invoiceNumber: "INV-00001",
      invoiceDate: new Date("2026-08-27"),
      dueDate: new Date("2026-09-27"),
      clientName: "John Doe",
      client: client._id,
      clientEmail: "john.doe@acme.com",
      clientPhone: "7654321098",
      clientAddress: "456 Corporate Blvd",
      items: [
        {
          description: "CRM Setup & Configuration Fee",
          quantity: 1,
          rate: 5000,
          amount: 5000
        }
      ],
      subtotal: 5000,
      tax: 900,
      discount: 500,
      totalAmount: 5400,
      paymentStatus: "Pending",
      paymentMethod: "Bank Transfer",
      paidAmount: 0,
      notes: "Initial setup fee invoice"
    });
    console.log(`✅ Invoice seeded: ${invoice.invoiceNumber}`);

    // ==========================================
    // 10. SEED PAYMENT
    // ==========================================
    console.log("Seeding Payment...");
    const payment = await Payment.create({
      invoiceId: invoice._id,
      amount: 2000,
      paymentMethod: "Bank Transfer",
      paymentDate: new Date("2026-08-27"),
      transactionId: "TXN987654321",
      status: "Completed",
      notes: "Partial payment for setup fee"
    });
    console.log(`✅ Payment seeded: ID ${payment._id} (${payment.amount})`);

    // ==========================================
    // 11. SEED MEETING
    // ==========================================
    console.log("Seeding Meeting...");
    const meeting = await Meeting.create({
      title: "CRM Discovery Call",
      description: "Review requirements and milestones for the custom CRM project.",
      clientId: client._id,
      projectId: project._id,
      meetingDate: new Date("2026-08-28"),
      startTime: "14:00",
      endTime: "15:00",
      meetingType: "Online",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      location: "",
      participants: [
        { name: "John Doe", email: "john.doe@acme.com" },
        { name: "Kamal Kumar", email: "kamal@odizocrm.com" }
      ],
      status: "Scheduled",
      notes: "Make sure to record the meeting."
    });
    console.log(`✅ Meeting seeded: ${meeting.title}`);

    // ==========================================
    // 12. SEED QUOTATION
    // ==========================================
    console.log("Seeding Quotation...");
    const quotation = await Quotation.create({
      quotationNumber: "QTN-2026-0001",
      quotationDate: new Date("2026-08-27"),
      validUntil: new Date("2026-09-27"),
      customerId: client._id,
      customerName: "John Doe",
      companyName: "Acme Corporation",
      customerEmail: "john.doe@acme.com",
      customerPhone: "7654321098",
      billingAddress: "456 Corporate Blvd",
      shippingAddress: "456 Corporate Blvd",
      gstin: "22AAAAA0000A1Z5",
      items: [
        {
          productName: "CRM License",
          description: "Standard enterprise user license",
          quantity: 1,
          rate: 5000,
          discount: 10,
          tax: 18,
          amount: 5310
        }
      ],
      subtotal: 5000,
      totalDiscount: 500,
      totalTax: 810,
      grandTotal: 5310,
      status: "Draft",
      notes: "Quotation valid for 30 days",
      termsAndConditions: "Payment terms net 30",
      createdBy: "Kamal Kumar"
    });
    console.log(`✅ Quotation seeded: ${quotation.quotationNumber}`);

    console.log("\n⭐️ DATABASE SEEDING COMPLETED SUCCESSFULY! ⭐️");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
