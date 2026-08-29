const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/Employee", require("./routes/EmployeeRoutes"));
app.use("/api/Admin", require("./routes/AdminRoutes"));
app.use("/api/Lead", require("./routes/LeadsRoutes"));
app.use("/api/User", require("./routes/UserRoutes"));
app.use("/api/Client", require("./routes/ClientRoutes"));
app.use("/api/Role", require("./routes/RoleRoutes"));
app.use("/api/Project", require("./routes/ProjectRoutes"));
app.use("/api/Report", require("./routes/ReportRoutes"));
app.use("/api/Task", require("./routes/taskRoutes"));
app.use("/api/Invoice", require("./routes/invoiceRoutes"));
app.use("/api/Payment", require("./routes/paymentRoutes"));
app.use("/api/Meeting", require("./routes/meetingRoutes"));
app.use("/api/Quotation", require("./routes/quotationRoutes"));

app.get("/", (req, res) => {
  res.send("Employee API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
