export const sendEmail = async ({ to, subject, text, html }) => {
  console.log("\n=============================");
  console.log("Mock Email Sent");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  if (text) console.log(`Text: ${text}`);
  if (html) console.log(`HTML: ${html}`);
  console.log("=============================\n");
  return true;
};
