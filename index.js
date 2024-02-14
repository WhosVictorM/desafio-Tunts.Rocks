const { google } = require("googleapis");

function situationCheck(average, absence) {
    if(absence <= 15){
        if(average >= 70){
            return "Approved"
        } else if (average >= 50 && average < 70){
            return "Final Exam"
        } else {
            return "Disapproved"
        }
    } else {
        return "Disapproved by absence"
    }
}

const auth = new google.auth.GoogleAuth({
  keyFile:
    "C://Users//victo//Desktop//Development//Vscode/TuntsRocks/credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const spreadsheetId = "1GNw9IFnNXapd8FcOzcuC11aYLUjQxOmqf4tLT8hkNyo";
const range = "A4:F27";

sheets.spreadsheets.values.get(
  {
    spreadsheetId,
    range,
  },
  (err, res) => {
    if (err) return console.log("Sheet not found", err);

    const rows = res.data.values;

    if (rows.length) {
      console.log("Grades: \n");
      rows.forEach((row => {
        const id = row[0];
        const name = row[1];
        const absence = parseInt(row[2]);
        const p1 = parseFloat(row[3]);
        const p2 = parseFloat(row[4]);
        const p3 = parseFloat(row[5]);
        const average = (p1 + p2 + p3) / 3;
        const situation = situationCheck(average, absence)

        console.log(`${name} AVG: ${average.toFixed(2)}\nAbsences: ${absence}\nSituation: ${situation}\n\n`);
      }))
    } else {
      console.log("No Data found");
    }
  }
);
