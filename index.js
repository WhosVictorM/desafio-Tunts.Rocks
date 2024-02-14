const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile:
    "C://Users//victo//Desktop//Development//Vscode/TuntsRocks/credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const spreadsheetId = "1GNw9IFnNXapd8FcOzcuC11aYLUjQxOmqf4tLT8hkNyo";
const range = "A4:F27";

