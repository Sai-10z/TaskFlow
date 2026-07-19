import cron from "node-cron";
import nodemailer from "nodemailer";
import pool from "../config/db.js";

// Keep a reference to the ethereal test account so we can log links
let transporter;

async function initMailer() {
  try {
    // Generate a test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    console.log("📧 Ethereal Email transporter initialized for testing.");
  } catch (error) {
    console.error("Failed to initialize mailer", error);
  }
}

initMailer();

// Helper to generate the email HTML
function generateEmailHTML(task) {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f1f5f9; padding: 40px; text-align: center;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: left;">
        <h2 style="color: #6366f1; margin-top: 0;">Task Deadline Approaching! ⏰</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">You have a task due tomorrow. Here are the details:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #0f172a;">${task.title}</h3>
          
          <p style="margin: 8px 0; color: #475569;"><strong>Deadline:</strong> ${new Date(task.deadline).toLocaleDateString()}</p>
          <p style="margin: 8px 0; color: #475569;">
            <strong>Priority:</strong> 
            <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; background-color: ${
              task.priority === 'HIGH' ? '#fee2e2' : task.priority === 'MEDIUM' ? '#fef3c7' : '#d1fae5'
            }; color: ${
              task.priority === 'HIGH' ? '#ef4444' : task.priority === 'MEDIUM' ? '#f59e0b' : '#10b981'
            };">
              ${task.priority}
            </span>
          </p>
        </div>
        
        <a href="http://localhost:5173/tasks" style="display: inline-block; margin-top: 25px; padding: 12px 24px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">View Your Tasks</a>
      </div>
      <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">TaskFlow Premium Productivity Workspace</p>
    </div>
  `;
}

// Function to check tasks and send emails
async function sendDailyReminders() {
  if (!transporter) return;
  
  console.log("🔍 Checking for tasks due tomorrow...");
  
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStart = new Date(tomorrow.setHours(0, 0, 0, 0));
    const tomorrowEnd = new Date(tomorrow.setHours(23, 59, 59, 999));
    
    // Query tasks due tomorrow that are not completed
    const result = await pool.query(`
      SELECT t.id, t.title, t.deadline, t.priority, u.email, u.username
      FROM tasks t
      JOIN users u ON t.user_id = u.id
      WHERE t.status != 'COMPLETED'
      AND t.deadline >= $1 AND t.deadline <= $2
    `, [tomorrowStart, tomorrowEnd]);
    
    const tasksDue = result.rows;
    console.log(`Found ${tasksDue.length} tasks due tomorrow.`);
    
    for (const task of tasksDue) {
      const info = await transporter.sendMail({
        from: '"TaskFlow Reminders" <reminders@taskflow.local>',
        to: task.email,
        subject: `Reminder: Task "${task.title}" is due tomorrow!`,
        html: generateEmailHTML(task),
      });
      
      console.log(`✅ Reminder sent to ${task.email} for task: ${task.title}`);
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
  } catch (error) {
    console.error("Error in daily reminder cron job:", error);
  }
}

export function startCronJobs() {
  console.log("⏰ Initializing Cron Jobs...");
  
  // For testing, run every minute if NODE_ENV is development, otherwise run daily at 00:00
  // Since it's for demonstration, let's run it every minute to verify it works quickly.
  // We can change this to '0 0 * * *' (daily at midnight) for production.
  cron.schedule("* * * * *", () => {
    sendDailyReminders();
  });
}
